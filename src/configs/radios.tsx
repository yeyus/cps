import { RadioDefinition } from "./radio-config";
import { QuanshengUVK5Definition } from "./radios/quansheng-uvk5";
import { RaddiodityGD88Definition } from "./radios/raddiodity-gd88";
import { RaddiodityGD77Definition } from "./radios/radioddity-gd77";

const RadioConfigs : RadioDefinition[] = [
    RaddiodityGD88Definition,
    RaddiodityGD77Definition,
    QuanshengUVK5Definition
];

export default RadioConfigs;