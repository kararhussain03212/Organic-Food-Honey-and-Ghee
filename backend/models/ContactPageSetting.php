<?php

declare(strict_types=1);

namespace Backend\Models;

require_once __DIR__ . '/BaseModel.php';

final class ContactPageSetting extends BaseModel
{
    protected string $table = 'contact_page_settings';
    protected array $fillable = [
        'hero_badge', 'hero_heading', 'hero_highlight', 'hero_description',
        'seo_meta_description',
        'form_title', 'name_placeholder', 'email_placeholder', 'phone_placeholder',
        'subject_placeholder', 'message_placeholder', 'submit_button_text',
        'availability_text', 'contact_heading', 'contact_description',
        'whatsapp_number', 'phone_number', 'email', 'address', 'google_map_url',
        'locations', 'facebook_url', 'instagram_url', 'youtube_url', 'tiktok_url',
    ];
}
