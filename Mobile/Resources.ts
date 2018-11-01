import * as tmp from "template|../assets/mobile/templates/templates.mobile.html";
import { context } from "context";
import { collection, encoding, net, basic } from "../lib/q/sys/Corelib";
import { defs } from "../lib/q/sys/defs";
import { UI, LoadDefaultCSS } from "../lib/q/sys/UI";
import { Controller } from "../lib/q/sys/System";
import { controls } from "./Core";
import { Load as gLoad } from '../lib/q/sys/Services';
import { basics } from "../abstract/extra/Basics";
import { GetVars } from "../abstract/extra/Common";

export function loadCss(callback?, onerror?) {
    var styles = ['Roboto', "style", "uisearch"];
    for (var i of styles)
        require('style|../assets/mobile/css/' + i + ".css", callback, onerror, context);
}
LoadDefaultCSS();
loadCss();


export namespace resources {
    export var GData: basics.vars;
    export var mobile = tmp.template['mobile'] as ITemplateModule;

    GetVars((vars) => { GData = clone(vars); return false; });
    export enum MdIcon {
        local_pharmacy, check_circle, chrome_reader_mode, class, code, compare_arrows, copyright, credit_card, dashboard, local_airport, link, inbox, gesture, forward, font_download, flag, filter_list, drafts, local_library, local_laundry_service, local_hotel, local_hospital, local_grocery_store, local_gas_station, local_florist, local_drink, local_dining, reply, reply_all, report, save, select_all, send, sort, text_format, layers, layers_clear, my_location, navigation, low_priority, mail, markunread, move_to_inbox, next_week, redo, remove, remove_circle, format_strikethrough, format_size, format_shapes, format_quote, format_paint, format_list_numbered, format_list_bulleted, format_line_spacing, format_italic, rv_hookup, location_city, mood, mood_bad, flash_auto, sync_disabled, sync_problem, subdirectory_arrow_right, subdirectory_arrow_left, refresh, more_vert, more_horiz, menu, last_page, place, rate_review, local_phone, bluetooth_audio, confirmation_number, disc_full, local_pizza, local_play, local_post_office, local_printshop, near_me, person_pin, person_pin_circle, pin_drop, system_update, tap_and_play, time_to_leave, vibration, voice_chat, casino, child_friendly, fitness_center, free_breakfast, golf_course, hot_tub, kitchen, pool, room_service, directions_car, directions_bus, sms, sms_failed, sync, battery_unknown, bluetooth, bluetooth_connected, flash_on, flash_off, restaurant_menu, satellite, store_mall_directory, streetview, subway, terrain, traffic, train, tram, check_box, check_box_outline_blank, indeterminate_check_box, radio_button_checked, radio_button_unchecked, star, star_border, map, transfer_within_a_station, zoom_out_map, apps, arrow_back, arrow_downward, school, sentiment_dissatisfied, sentiment_neutral, sentiment_satisfied, sentiment_very_dissatisfied, sentiment_very_satisfied, share, whatshot, local_taxi, add_to_photos, add_a_photo, watch, videogame_asset, tv, local_activity, star_half, local_atm, local_bar, local_cafe, local_car_wash, local_convenience_store, add_location, fullscreen_exit, fullscreen, first_page, expand_more, child_care, notifications, notifications_active, notifications_none, notifications_off, notifications_paused, arrow_drop_down, local_see, local_shipping, cake, domain, group, group_add, content_cut, content_paste, create, delete_sweep, smoke_free, smoking_rooms, spa, image_aspect_ratio, image, healing, hdr_weak, hdr_strong, hdr_on, hdr_off, grid_on, directions_railway, directions_run, directions_subway, directions_transit, directions_walk, edit_location, ev_station, flight, hotel, unarchive, undo, weekend, access_alarm, access_alarms, access_time, add_alarm, airplanemode_active, airplanemode_inactive, restaurant, directions_boat, directions_bike, directions, beenhere, business_center, beach_access, all_inclusive, airport_shuttle, ac_unit, wifi, wc, vpn_lock, format_textdirection_l_to_r, grid_off, grain, gradient, flip, local_parking, local_offer, local_movies, local_mall, battery_alert, battery_charging_full, battery_full, battery_std, public, poll, plus_one, person_outline, person_add, person, people_outline, people, party_mode, pages, remove_circle_outline, flare, filter_vintage, filter_tilt_shift, adb, airline_seat_flat, airline_seat_flat_angled, airline_seat_individual_suite, airline_seat_legroom_extra, airline_seat_legroom_normal, airline_seat_legroom_reduced, airline_seat_recline_extra, airline_seat_recline_normal, cast, cast_connected, computer, desktop_mac, arrow_drop_down_circle, arrow_drop_up, arrow_forward, arrow_upward, cancel, check, chevron_left, chevron_right, close, expand_less, bluetooth_disabled, bluetooth_searching, brightness_auto, brightness_high, brightness_low, brightness_medium, data_usage, developer_mode, devices, dvr, gps_fixed, gps_not_fixed, gps_off, graphic_eq, location_disabled, location_searching, network_cell, network_wifi, nfc, screen_lock_landscape, screen_lock_portrait, screen_lock_rotation, screen_rotation, sd_storage, settings_system_daydream, signal_cellular_4_bar, signal_cellular_connected_no_internet_4_bar, signal_cellular_no_sim, signal_cellular_null, signal_cellular_off, signal_wifi_4_bar, signal_wifi_4_bar_lock, signal_wifi_off, storage, usb, wallpaper, widgets, wifi_lock, wifi_tethering, attach_file, attach_money, border_all, border_bottom, border_clear, border_color, border_horizontal, border_inner, border_left, border_outer, border_right, border_style, border_top, border_vertical, bubble_chart, drag_handle, format_align_center, format_align_justify, format_align_left, format_align_right, format_bold, format_clear, format_color_fill, format_color_reset, format_color_text, format_indent_decrease, format_indent_increase, sim_card_alert, sd_card, priority_high, power, phone_paused, phone_missed, phone_locked, phone_in_talk, phone_forwarded, phone_bluetooth_speaker, personal_video, ondemand_video, no_encryption, network_locked, network_check, more, mms, live_tv, folder_special, event_note, event_busy, event_available, enhanced_encryption, drive_eta, do_not_disturb_on, do_not_disturb_off, do_not_disturb_alt, do_not_disturb, fiber_smart_record, forward_10, forward_30, forward_5, games, hd, hearing, high_quality, library_add, library_books, library_music, loop, mic, mic_none, mic_off, movie, music_video, new_releases, not_interested, note, pause, pause_circle_filled, pause_circle_outline, play_arrow, play_circle_filled, play_circle_outline, playlist_add, playlist_add_check, playlist_play, queue, queue_music, queue_play_next, radio, recent_actors, remove_from_queue, repeat, repeat_one, replay, replay_10, replay_30, replay_5, shuffle, skip_next, skip_previous, slow_motion_video, snooze, sort_by_alpha, stop, subscriptions, subtitles, surround_sound, video_call, video_label, video_library, videocam, videocam_off, volume_down, volume_mute, volume_off, volume_up, web, web_asset, business, call, call_end, call_made, call_merge, call_missed, call_missed_outgoing, call_received, call_split, chat, chat_bubble, chat_bubble_outline, clear_all, comment, contact_mail, contact_phone, contacts, dialer_sip, dns,
        delete, delete_forever
    }
    gLoad(GData.requester);
}

export namespace Common {

    export interface IPage extends defs.UI.IPage {
        Name: string;
        Url: string;
        Glyph: string;
        dom?: Element;
        Options: collection.List<IOption>;
        OnOptionExecuted(op: IPopEventArgs<IOption>);
        OnOptionOpening(): boolean;
        Update();
        OnAttached();
        OnDetached();
    }

    export interface IOption {
        Title: string;
        OnOptionClicked?: (op: this, app: controls.EMobileApp, page: IPage) => void;
    }
    export interface IPopEventArgs<T> {
        Pop: controls.Pop<T>;
        Data: T;
        Cancel: boolean;
        Result: UI.MessageResult;
        Wait?: this;
    }
    export interface ITeta {
        Setting: controls.Settings;
        Auth: controls.AuthApp;
        App: controls.EMobileApp;
    }
    export enum ServerStat {
        Undefinned = 0,
        UnAvaible = 1,
        Connecting = 2,
        Disconnected = 8 | 6,
        Connected = 16 | 6
    }
}