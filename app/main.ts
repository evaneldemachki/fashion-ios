// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { enableProdMode } from '@angular/core';
import {registerElement} from "nativescript-angular/element-registry";

import { AppModule } from "./app.module";
import { Fontawesome } from 'nativescript-fontawesome';

Fontawesome.init();

enableProdMode();
platformNativeScriptDynamic().bootstrapModule(AppModule);
