package com.kf3ppp.pomodoro;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.SystemClock;
import android.widget.RemoteViews;

import java.util.Locale;

/**
 * Native Android home-screen widget for the Pomodoro timer.
 *
 * State (running / mode / remaining time) is kept in SharedPreferences so it
 * survives widget updates, reboots and app restarts. While the timer is
 * running, an inexact repeating AlarmManager alarm ticks once a minute to
 * refresh the displayed countdown (Android does not allow per-second widget
 * updates, so the minute is the practical resolution for a home screen
 * widget).
 */
public class PomodoroWidgetProvider extends AppWidgetProvider {

    private static final String PREFS_NAME = "pomodoro_widget_prefs";
    private static final String KEY_MODE = "mode"; // "focus" | "short" | "long"
    private static final String KEY_IS_RUNNING = "is_running";
    private static final String KEY_END_ELAPSED = "end_elapsed_realtime"; // when running
    private static final String KEY_REMAINING_MS = "remaining_ms"; // when paused

    public static final String ACTION_TOGGLE = "com.kf3ppp.pomodoro.widget.ACTION_TOGGLE";
    public static final String ACTION_TICK = "com.kf3ppp.pomodoro.widget.ACTION_TICK";

    private static final long FOCUS_MS = 25 * 60 * 1000L;
    private static final long SHORT_BREAK_MS = 5 * 60 * 1000L;
    private static final long LONG_BREAK_MS = 15 * 60 * 1000L;

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, widgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent.getAction();

        if (ACTION_TOGGLE.equals(action)) {
            toggleRunning(context);
            refreshAllWidgets(context);
        } else if (ACTION_TICK.equals(action)) {
            handleTick(context);
            refreshAllWidgets(context);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // First widget instance placed on the home screen.
        SharedPreferences prefs = prefs(context);
        if (!prefs.contains(KEY_MODE)) {
            prefs.edit()
                    .putString(KEY_MODE, "focus")
                    .putBoolean(KEY_IS_RUNNING, false)
                    .putLong(KEY_REMAINING_MS, FOCUS_MS)
                    .apply();
        }
    }

    @Override
    public void onDisabled(Context context) {
        // Last widget instance removed - stop the tick alarm.
        cancelTickAlarm(context);
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    private static long durationForMode(String mode) {
        switch (mode) {
            case "short":
                return SHORT_BREAK_MS;
            case "long":
                return LONG_BREAK_MS;
            default:
                return FOCUS_MS;
        }
    }

    private static String labelForMode(String mode) {
        switch (mode) {
            case "short":
                return "Short Break";
            case "long":
                return "Long Break";
            default:
                return "Focus";
        }
    }

    /** Returns remaining milliseconds for the current state, clamped to >= 0. */
    private static long getRemainingMs(SharedPreferences prefs) {
        boolean running = prefs.getBoolean(KEY_IS_RUNNING, false);
        if (running) {
            long endElapsed = prefs.getLong(KEY_END_ELAPSED, 0);
            long remaining = endElapsed - SystemClock.elapsedRealtime();
            return Math.max(remaining, 0);
        }
        String mode = prefs.getString(KEY_MODE, "focus");
        return prefs.getLong(KEY_REMAINING_MS, durationForMode(mode));
    }

    private void toggleRunning(Context context) {
        SharedPreferences prefs = prefs(context);
        boolean running = prefs.getBoolean(KEY_IS_RUNNING, false);
        String mode = prefs.getString(KEY_MODE, "focus");

        if (running) {
            // Pause: freeze remaining time.
            long remaining = getRemainingMs(prefs);
            prefs.edit()
                    .putBoolean(KEY_IS_RUNNING, false)
                    .putLong(KEY_REMAINING_MS, remaining)
                    .apply();
            cancelTickAlarm(context);
        } else {
            // Start: compute the absolute end time.
            long remaining = prefs.getLong(KEY_REMAINING_MS, durationForMode(mode));
            if (remaining <= 0) remaining = durationForMode(mode);
            long endElapsed = SystemClock.elapsedRealtime() + remaining;
            prefs.edit()
                    .putBoolean(KEY_IS_RUNNING, true)
                    .putLong(KEY_END_ELAPSED, endElapsed)
                    .apply();
            scheduleTickAlarm(context);
        }
    }

    private void handleTick(Context context) {
        SharedPreferences prefs = prefs(context);
        boolean running = prefs.getBoolean(KEY_IS_RUNNING, false);
        if (!running) return;

        long remaining = getRemainingMs(prefs);
        if (remaining <= 0) {
            // Session finished: advance to the next mode and stop.
            String mode = prefs.getString(KEY_MODE, "focus");
            String nextMode = "focus".equals(mode) ? "short" : "focus";
            prefs.edit()
                    .putString(KEY_MODE, nextMode)
                    .putBoolean(KEY_IS_RUNNING, false)
                    .putLong(KEY_REMAINING_MS, durationForMode(nextMode))
                    .apply();
            cancelTickAlarm(context);
        }
    }

    private void scheduleTickAlarm(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent intent = new Intent(context, PomodoroWidgetProvider.class);
        intent.setAction(ACTION_TICK);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        // Minute resolution is the practical limit for home-screen widgets.
        alarmManager.setInexactRepeating(
                AlarmManager.ELAPSED_REALTIME,
                SystemClock.elapsedRealtime() + AlarmManager.INTERVAL_MINUTE,
                AlarmManager.INTERVAL_MINUTE,
                pendingIntent);
    }

    private void cancelTickAlarm(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent intent = new Intent(context, PomodoroWidgetProvider.class);
        intent.setAction(ACTION_TICK);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        alarmManager.cancel(pendingIntent);
    }

    private static void refreshAllWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName component = new ComponentName(context, PomodoroWidgetProvider.class);
        int[] ids = manager.getAppWidgetIds(component);
        for (int id : ids) {
            updateWidget(context, manager, id);
        }
    }

    private static void updateWidget(Context context, AppWidgetManager appWidgetManager, int widgetId) {
        SharedPreferences prefs = prefs(context);
        String mode = prefs.getString(KEY_MODE, "focus");
        boolean running = prefs.getBoolean(KEY_IS_RUNNING, false);
        long remainingMs = getRemainingMs(prefs);

        long totalSeconds = remainingMs / 1000;
        long minutes = totalSeconds / 60;
        long seconds = totalSeconds % 60;
        String timeText = String.format(Locale.US, "%02d:%02d", minutes, seconds);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_pomodoro);
        views.setTextViewText(R.id.widget_time, timeText);
        views.setTextViewText(R.id.widget_mode, labelForMode(mode));
        views.setImageViewResource(
                R.id.widget_play_icon,
                running ? R.drawable.ic_widget_pause : R.drawable.ic_widget_play);

        // Tapping the play/pause button toggles the timer without opening the app.
        Intent toggleIntent = new Intent(context, PomodoroWidgetProvider.class);
        toggleIntent.setAction(ACTION_TOGGLE);
        PendingIntent togglePendingIntent = PendingIntent.getBroadcast(
                context, widgetId, toggleIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_play_button, togglePendingIntent);

        // Tapping the rest of the widget opens the app.
        Intent openAppIntent = new Intent(context, MainActivity.class);
        PendingIntent openAppPendingIntent = PendingIntent.getActivity(
                context, widgetId, openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_title, openAppPendingIntent);

        appWidgetManager.updateAppWidget(widgetId, views);

        if (running) {
            scheduleTickAlarmStatic(context);
        }
    }

    private static void scheduleTickAlarmStatic(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;
        Intent intent = new Intent(context, PomodoroWidgetProvider.class);
        intent.setAction(ACTION_TICK);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        alarmManager.setInexactRepeating(
                AlarmManager.ELAPSED_REALTIME,
                SystemClock.elapsedRealtime() + AlarmManager.INTERVAL_MINUTE,
                AlarmManager.INTERVAL_MINUTE,
                pendingIntent);
    }
}
