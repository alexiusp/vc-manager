import {BrowserXhr} from "angular2/http";
import {Injectable} from "angular2/core";

@Injectable()
export class CORSBrowserXHR extends BrowserXhr{
    build(): any{
        var xhr:any = super.build();
        xhr.withCredentials = true;
        return xhr;
    }
}
