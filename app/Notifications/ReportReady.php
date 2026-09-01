<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class ReportReady extends Notification
{
    use Queueable;

    public function __construct(
        public string $downloadUrl,
        public string $format
    ) {}

    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title('Bulk Export Ready')
            ->body("Your requested " . strtoupper($this->format) . " report has finished processing and is ready for download.")
            ->action('Download', 'download')
            ->data(['url' => $this->downloadUrl])
            ->icon('/pwa-192x192.png');
    }
}
