<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class NewUserRegistered extends Notification
{
    public function __construct(protected User $newUser) {}

    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title('New Account Pending Approval')
            ->body("{$this->newUser->name} registered and is awaiting approval.")
            ->action('Review', 'view')
            ->data(['url' => '/user-accounts'])
            ->icon('/pwa-192x192.png');
    }
}