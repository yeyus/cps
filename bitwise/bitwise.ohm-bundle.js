'use strict';const {makeRecipe}=require('ohm-js');const result=makeRecipe(["grammar",{"source":"Bitwise {\n  Script = Exp*\n  \n  Exp =\n    | StructExp \n    | FieldExp\n    | comment\n    \n  DirectiveExp = \"#\" directiveToken (hexaddress|offset) \";\"\n  \n  StructExp = DirectiveExp? \"struct\" \"{\" Exp+ \"}\" fieldName (\"[\" length \"]\")? \";\"\n  \n  FieldExp = DirectiveExp? typeToken FieldDefinitionExp (\"[\" length \"]\")? \";\"\n\n  FieldDefinitionExp = \n    | FieldMaskDefinitionListExp\n    | fieldName\n\n  FieldMaskDefinitionExp = fieldName \":\" length\n\n  FieldMaskDefinitionListExp = (FieldMaskDefinitionExp \",\")* FieldMaskDefinitionExp\n  \n  comment =\n    | singleLineComment\n    | multiLineComment\n\n  multiLineComment = \n    | \"/*\" multiLineCommentChars? \"*/\"\n\n  multiLineCommentChars = \n    (~\"*/\" any)*\n  \n  singleLineComment = \n    | \"//\" singleLineCommentChars?\n\n  singleLineCommentChars = \n    | singleLineCommentChar+\n\n  singleLineCommentChar = \n    | ~lineTerminator any\n  \n  directiveToken = \n    | \"seekto\" \n    | \"seek\" \n    | \"printoffset\"\n    \n  hexaddress = \"0x\" hexdigit+\n\n  offset = digit+\n\n  length = digit+\n\n  hexdigit = digit | \"a\"..\"f\" | \"A\"..\"F\"\n\n  fieldName = lower (letter|digit|\"_\")+\n  \n  typeToken = \n    | \"bit\" \n    | \"u8\" \n    | \"u16\" \n    | \"ul16\" \n    | \"u24\" \n    | \"ul24\" \n    | \"u32\" \n    | \"ul32\" \n    | \"i8\" \n    | \"i16\" \n    | \"il16\" \n    | \"i24\" \n    | \"il24\" \n    | \"i32\" \n    | \"il32\" \n    | \"char\" \n    | \"lbcd\" \n    | \"bbcd\"\n        \n  lineTerminator = \n    | \"\\n\"\n    | \"\\r\"\n    | \"\\u2028\"\n    | \"\\u2029\"\n}"},"Bitwise",null,"Script",{"Script":["define",{"sourceInterval":[12,25]},null,[],["star",{"sourceInterval":[21,25]},["app",{"sourceInterval":[21,24]},"Exp",[]]]],"Exp":["define",{"sourceInterval":[31,82]},null,[],["alt",{"sourceInterval":[41,82]},["app",{"sourceInterval":[43,52]},"StructExp",[]],["app",{"sourceInterval":[60,68]},"FieldExp",[]],["app",{"sourceInterval":[75,82]},"comment",[]]]],"DirectiveExp":["define",{"sourceInterval":[90,147]},null,[],["seq",{"sourceInterval":[105,147]},["terminal",{"sourceInterval":[105,108]},"#"],["app",{"sourceInterval":[109,123]},"directiveToken",[]],["alt",{"sourceInterval":[125,142]},["app",{"sourceInterval":[125,135]},"hexaddress",[]],["app",{"sourceInterval":[136,142]},"offset",[]]],["terminal",{"sourceInterval":[144,147]},";"]]],"StructExp":["define",{"sourceInterval":[153,232]},null,[],["seq",{"sourceInterval":[165,232]},["opt",{"sourceInterval":[165,178]},["app",{"sourceInterval":[165,177]},"DirectiveExp",[]]],["terminal",{"sourceInterval":[179,187]},"struct"],["terminal",{"sourceInterval":[188,191]},"{"],["plus",{"sourceInterval":[192,196]},["app",{"sourceInterval":[192,195]},"Exp",[]]],["terminal",{"sourceInterval":[197,200]},"}"],["app",{"sourceInterval":[201,210]},"fieldName",[]],["opt",{"sourceInterval":[211,228]},["seq",{"sourceInterval":[212,226]},["terminal",{"sourceInterval":[212,215]},"["],["app",{"sourceInterval":[216,222]},"length",[]],["terminal",{"sourceInterval":[223,226]},"]"]]],["terminal",{"sourceInterval":[229,232]},";"]]],"FieldExp":["define",{"sourceInterval":[238,313]},null,[],["seq",{"sourceInterval":[249,313]},["opt",{"sourceInterval":[249,262]},["app",{"sourceInterval":[249,261]},"DirectiveExp",[]]],["app",{"sourceInterval":[263,272]},"typeToken",[]],["app",{"sourceInterval":[273,291]},"FieldDefinitionExp",[]],["opt",{"sourceInterval":[292,309]},["seq",{"sourceInterval":[293,307]},["terminal",{"sourceInterval":[293,296]},"["],["app",{"sourceInterval":[297,303]},"length",[]],["terminal",{"sourceInterval":[304,307]},"]"]]],["terminal",{"sourceInterval":[310,313]},";"]]],"FieldDefinitionExp":["define",{"sourceInterval":[317,387]},null,[],["alt",{"sourceInterval":[343,387]},["app",{"sourceInterval":[345,371]},"FieldMaskDefinitionListExp",[]],["app",{"sourceInterval":[378,387]},"fieldName",[]]]],"FieldMaskDefinitionExp":["define",{"sourceInterval":[391,436]},null,[],["seq",{"sourceInterval":[416,436]},["app",{"sourceInterval":[416,425]},"fieldName",[]],["terminal",{"sourceInterval":[426,429]},":"],["app",{"sourceInterval":[430,436]},"length",[]]]],"FieldMaskDefinitionListExp":["define",{"sourceInterval":[440,521]},null,[],["seq",{"sourceInterval":[469,521]},["star",{"sourceInterval":[469,498]},["seq",{"sourceInterval":[470,496]},["app",{"sourceInterval":[470,492]},"FieldMaskDefinitionExp",[]],["terminal",{"sourceInterval":[493,496]},","]]],["app",{"sourceInterval":[499,521]},"FieldMaskDefinitionExp",[]]]],"comment":["define",{"sourceInterval":[527,583]},null,[],["alt",{"sourceInterval":[541,583]},["app",{"sourceInterval":[543,560]},"singleLineComment",[]],["app",{"sourceInterval":[567,583]},"multiLineComment",[]]]],"multiLineComment":["define",{"sourceInterval":[587,645]},null,[],["seq",{"sourceInterval":[611,645]},["terminal",{"sourceInterval":[613,617]},"/*"],["opt",{"sourceInterval":[618,640]},["app",{"sourceInterval":[618,639]},"multiLineCommentChars",[]]],["terminal",{"sourceInterval":[641,645]},"*/"]]],"multiLineCommentChars":["define",{"sourceInterval":[649,690]},null,[],["star",{"sourceInterval":[678,690]},["seq",{"sourceInterval":[679,688]},["not",{"sourceInterval":[679,684]},["terminal",{"sourceInterval":[680,684]},"*/"]],["app",{"sourceInterval":[685,688]},"any",[]]]]],"singleLineComment":["define",{"sourceInterval":[696,751]},null,[],["seq",{"sourceInterval":[721,751]},["terminal",{"sourceInterval":[723,727]},"//"],["opt",{"sourceInterval":[728,751]},["app",{"sourceInterval":[728,750]},"singleLineCommentChars",[]]]]],"singleLineCommentChars":["define",{"sourceInterval":[755,809]},null,[],["plus",{"sourceInterval":[785,809]},["app",{"sourceInterval":[787,808]},"singleLineCommentChar",[]]]],"singleLineCommentChar":["define",{"sourceInterval":[813,863]},null,[],["seq",{"sourceInterval":[842,863]},["not",{"sourceInterval":[844,859]},["app",{"sourceInterval":[845,859]},"lineTerminator",[]]],["app",{"sourceInterval":[860,863]},"any",[]]]],"directiveToken":["define",{"sourceInterval":[869,936]},null,[],["alt",{"sourceInterval":[891,936]},["terminal",{"sourceInterval":[893,901]},"seekto"],["terminal",{"sourceInterval":[909,915]},"seek"],["terminal",{"sourceInterval":[923,936]},"printoffset"]]],"hexaddress":["define",{"sourceInterval":[944,971]},null,[],["seq",{"sourceInterval":[957,971]},["terminal",{"sourceInterval":[957,961]},"0x"],["plus",{"sourceInterval":[962,971]},["app",{"sourceInterval":[962,970]},"hexdigit",[]]]]],"offset":["define",{"sourceInterval":[975,990]},null,[],["plus",{"sourceInterval":[984,990]},["app",{"sourceInterval":[984,989]},"digit",[]]]],"length":["define",{"sourceInterval":[994,1009]},null,[],["plus",{"sourceInterval":[1003,1009]},["app",{"sourceInterval":[1003,1008]},"digit",[]]]],"hexdigit":["define",{"sourceInterval":[1013,1051]},null,[],["alt",{"sourceInterval":[1024,1051]},["app",{"sourceInterval":[1024,1029]},"digit",[]],["range",{"sourceInterval":[1032,1040]},"a","f"],["range",{"sourceInterval":[1043,1051]},"A","F"]]],"fieldName":["define",{"sourceInterval":[1055,1092]},null,[],["seq",{"sourceInterval":[1067,1092]},["app",{"sourceInterval":[1067,1072]},"lower",[]],["plus",{"sourceInterval":[1073,1092]},["alt",{"sourceInterval":[1074,1090]},["app",{"sourceInterval":[1074,1080]},"letter",[]],["app",{"sourceInterval":[1081,1086]},"digit",[]],["terminal",{"sourceInterval":[1087,1090]},"_"]]]]],"typeToken":["define",{"sourceInterval":[1098,1350]},null,[],["alt",{"sourceInterval":[1115,1350]},["terminal",{"sourceInterval":[1117,1122]},"bit"],["terminal",{"sourceInterval":[1130,1134]},"u8"],["terminal",{"sourceInterval":[1142,1147]},"u16"],["terminal",{"sourceInterval":[1155,1161]},"ul16"],["terminal",{"sourceInterval":[1169,1174]},"u24"],["terminal",{"sourceInterval":[1182,1188]},"ul24"],["terminal",{"sourceInterval":[1196,1201]},"u32"],["terminal",{"sourceInterval":[1209,1215]},"ul32"],["terminal",{"sourceInterval":[1223,1227]},"i8"],["terminal",{"sourceInterval":[1235,1240]},"i16"],["terminal",{"sourceInterval":[1248,1254]},"il16"],["terminal",{"sourceInterval":[1262,1267]},"i24"],["terminal",{"sourceInterval":[1275,1281]},"il24"],["terminal",{"sourceInterval":[1289,1294]},"i32"],["terminal",{"sourceInterval":[1302,1308]},"il32"],["terminal",{"sourceInterval":[1316,1322]},"char"],["terminal",{"sourceInterval":[1330,1336]},"lbcd"],["terminal",{"sourceInterval":[1344,1350]},"bbcd"]]],"lineTerminator":["define",{"sourceInterval":[1362,1431]},null,[],["alt",{"sourceInterval":[1384,1431]},["terminal",{"sourceInterval":[1386,1390]},"\n"],["terminal",{"sourceInterval":[1397,1401]},"\r"],["terminal",{"sourceInterval":[1408,1416]},"\u2028"],["terminal",{"sourceInterval":[1423,1431]},"\u2029"]]]}]);module.exports=result;