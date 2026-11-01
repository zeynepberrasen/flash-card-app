package com.anonymous.flashcardapp

import android.content.Context
import android.content.Intent
import android.net.Uri
import expo.modules.widgets.ExpoWidgetsAppWidgetProvider

class FlashcardWidgetProvider : ExpoWidgetsAppWidgetProvider("FlashcardWidget") {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == "expo.modules.widgets.ACTION_WIDGET_INTERACTION") {
      val target = intent.getStringExtra("expo.modules.widgets.extra.TARGET")
      // When clicking any button other than "reveal" (e.g. "open_app"), launch the application!
      if (target != null && target != "reveal") {
        try {
          val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            if (target.startsWith("mobile://")) {
              data = Uri.parse(target)
            }
          }
          if (launchIntent != null) {
            context.startActivity(launchIntent)
          }
        } catch (e: Exception) {
          e.printStackTrace()
        }
      }
    }

    super.onReceive(context, intent)
  }
}


