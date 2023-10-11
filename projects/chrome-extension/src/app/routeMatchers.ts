import { inject } from "@angular/core"
import { CanMatchFn } from "@angular/router"
import { ConfigService, ExtensionMode } from "./core/services/config.service"
import { map } from "rxjs/operators";

export const getRouteMatcherByExtensionMode:(mode: ExtensionMode) => CanMatchFn = (mode: ExtensionMode) => {
    let configService = inject(ConfigService);
    return () => configService.getExtensionMode().pipe(map(res => res == mode));
}