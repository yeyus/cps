/* eslint-disable import/prefer-default-export */
export const TEST = `
#seekto 0x0000;
struct {
  ul32 freq;
  ul32 offset;
  u8 rxcode;
  u8 txcode;

  u8 txcodeflag:4,
     rxcodeflag:4;

  //u8 flags1;
  u8 flags1_unknown7:1,
  flags1_unknown6:1,
  flags1_unknown5:1,
  enable_am:1,
  flags1_unknown3:1,
  is_in_scanlist:1,
  shift:2;

  //u8 flags2;
  u8 flags2_unknown7:1,
  flags2_unknown6:1,
  flags2_unknown5:1,
  bclo:1,
  txpower:2,
  bandwidth:1,
  freq_reverse:1;

  //u8 dtmf_flags;
  u8 dtmf_flags_unknown7:1,
  dtmf_flags_unknown6:1,
  dtmf_flags_unknown5:1,
  dtmf_flags_unknown4:1,
  dtmf_flags_unknown3:1,
  dtmf_pttid:2,
  dtmf_decode:1;


  u8 step;
  u8 scrambler;
} channel[214];

#seekto 0xd60;
struct {
u8 is_scanlist1:1,
is_scanlist2:1,
compander:2,
is_free:1,
band:3;
} channel_attributes[200];

#seekto 0xe40;
ul16 fmfreq[20];

#seekto 0xe70;
u8 call_channel;
u8 squelch;
u8 max_talk_time;
u8 noaa_autoscan;
u8 key_lock;
u8 vox_switch;
u8 vox_level;
u8 mic_gain;
u8 unknown3;
u8 channel_display_mode;
u8 crossband;
u8 battery_save;
u8 dual_watch;
u8 backlight_auto_mode;
u8 tail_note_elimination;
u8 vfo_open;

#seekto 0xe90;
u8 beep_control;
u8 key1_shortpress_action;
u8 key1_longpress_action;
u8 key2_shortpress_action;
u8 key2_longpress_action;
u8 scan_resume_mode;
u8 auto_keypad_lock;
u8 power_on_dispmode;
u8 password[4];

#seekto 0xea0;
u8 keypad_tone;
u8 language;

#seekto 0xea8;
u8 alarm_mode;
u8 reminding_of_end_talk;
u8 repeater_tail_elimination;

#seekto 0xeb0;
char logo_line1[16];
char logo_line2[16];

#seekto 0xed0;
struct {
u8 side_tone;
char separate_code;
char group_call_code;
u8 decode_response;
u8 auto_reset_time;
u8 preload_time;
u8 first_code_persist_time;
u8 hash_persist_time;
u8 code_persist_time;
u8 code_interval_time;
u8 permit_remote_kill;
} dtmf_settings;

#seekto 0xee0;
struct {
char dtmf_local_code[3];
char unused1[5];
char kill_code[5];
char unused2[3];
char revive_code[5];
char unused3[3];
char dtmf_up_code[16];
char dtmf_down_code[16];
} dtmf_settings_numbers;

#seekto 0xf18;
u8 scanlist_default;
u8 scanlist1_priority_scan;
u8 scanlist1_priority_ch1;
u8 scanlist1_priority_ch2;
u8 scanlist2_priority_scan;
u8 scanlist2_priority_ch1;
u8 scanlist2_priority_ch2;
u8 scanlist_unknown_0xff;


#seekto 0xf40;
struct {
u8 flock;
u8 tx350;
u8 killed;
u8 tx200;
u8 tx500;
u8 en350;
u8 enscramble;
} lock;

#seekto 0xf50;
struct {
char name[16];
} channelname[200];

#seekto 0x1c00;
struct {
char name[8];
char number[3];
char unused_00[5];
} dtmfcontact[16];

#seekto 0x1ed0;
struct {
struct {
    u8 start;
    u8 mid;
    u8 end;
} low;
struct {
    u8 start;
    u8 mid;
    u8 end;
} medium;
struct {
    u8 start;
    u8 mid;
    u8 end;
} high;
u8 unused_00[7];
} perbandpowersettings[7];

#seekto 0x1f40;
ul16 battery_level[6];
`;
