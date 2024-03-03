import { SerialRadio } from "@modules/radio-types/transports/serial/serial";
import { RadioDefinition } from "./radio-config";
import { QuanshengUVK5Definition } from "./radios/quansheng/uvk5/radio";
import { RaddiodityGD88Definition } from "./radios/raddiodity-gd88";

const RadioConfigs: RadioDefinition<SerialRadio>[] = [RaddiodityGD88Definition, QuanshengUVK5Definition];

export default RadioConfigs;
