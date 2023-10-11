import { SafeUrl } from "@angular/platform-browser";
import { Language } from "./language.model";

export interface MarketingImage {
    id: Number,
    imageName: string,
    marketingImage: string,
    language: Language, 
    duration: Number,
    priority: Number
}