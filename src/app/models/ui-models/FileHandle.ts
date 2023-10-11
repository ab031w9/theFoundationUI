import { SafeUrl } from "@angular/platform-browser";
import { Language } from "../api-models/language.model";

export interface FileHandle {
    file: File,
    url: SafeUrl,
    language: Language, 
    imageName: string,
    duration: Number,
    priority: Number
}