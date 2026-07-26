<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class DistributionNeedsReview extends Notification
{
    public function __construct(protected array $warnings) {}

    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification): WebPushMessage
    {
        $reason = $this->warnings['is_duplicate']
            ? 'a possible duplicate'
            : 'exceeding program allocation';

        return (new WebPushMessage)
            ->title('Offline Distribution Needs Review')
            ->body("A synced distribution was flagged as {$reason} and needs your review.")
            ->action('Review', 'view')
            ->data(['url' => '/offline-queue'])
            ->icon('/pwa-192x192.png');
    }
}