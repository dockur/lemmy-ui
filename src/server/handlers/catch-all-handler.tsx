import { initializeSite, isAuthPath } from "@utils/app";
import { getHttpBaseInternal } from "@utils/env";
import { ErrorPageData } from "@utils/types";
import type { Request, Response } from "express";
import { StaticRouter, matchPath } from "inferno-router";
import { renderToString } from "inferno-server";
import { GetSiteResponse, LemmyHttp } from "lemmy-js-client";
import { App } from "../../shared/components/app/app";
import {
  InitialFetchRequest,
  IsoDataOptionalSite,
  RouteData,
} from "../../shared/interfaces";
import { routes } from "../../shared/routes";
import {
  FailedRequestState,
  wrapClient,
} from "../../shared/services/HttpService";
import { createSsrHtml } from "../utils/create-ssr-html";
import { getErrorPageData } from "../utils/get-error-page-data";
import { setForwardedHeaders } from "../utils/set-forwarded-headers";
import { getJwtCookie } from "../utils/has-jwt-cookie";

export default async (req: Request, res: Response) => {

  console.time('catch');
  console.time('catch1');
  
  try {
    const activeRoute = routes.find(route => matchPath(req.path, route));

    const headers = setForwardedHeaders(req.headers);
    const auth = getJwtCookie(req.headers);

    const client = wrapClient(
      new LemmyHttp(getHttpBaseInternal(), { headers }),
    );
    console.timeEnd('catch1');
    console.time('catch2');
    const { path, url, query } = req;

    // Get site data first
    // This bypasses errors, so that the client can hit the error on its own,
    // in order to remove the jwt on the browser. Necessary for wrong jwts
    let site: GetSiteResponse | undefined = undefined;
    let routeData: RouteData = {};
    let errorPageData: ErrorPageData | undefined = undefined;
    let try_site = await client.getSite();
    console.timeEnd('catch2');
    console.time('catch3');
    if (
      try_site.state === "failed" &&
      try_site.err.message === "not_logged_in"
    ) {
      console.error(
        "Incorrect JWT token, skipping auth so frontend can remove jwt cookie",
      );
      client.setHeaders({});
      try_site = await client.getSite();
    }
    console.timeEnd('catch3');
    console.time('catch4');
    if (!auth && isAuthPath(path)) {
      return res.redirect(`/login?prev=${encodeURIComponent(url)}`);
    }

    if (try_site.state === "success") {
      site = try_site.data;
      initializeSite(site);

      if (path !== "/setup" && !site.site_view.local_site.site_setup) {
        return res.redirect("/setup");
      }
      console.timeEnd('catch4');
      console.time('catch5');
      if (site && activeRoute?.fetchInitialData) {
        const initialFetchReq: InitialFetchRequest = {
          path,
          query,
          site,
          headers,
        };

        routeData = await activeRoute.fetchInitialData(initialFetchReq);
      }
      console.timeEnd('catch5');
      console.time('catch6');
      if (!activeRoute) {
        res.status(404);
      }
    } else if (try_site.state === "failed") {
      res.status(500);
      errorPageData = getErrorPageData(new Error(try_site.err.message), site);
    }

    const error = Object.values(routeData).find(
      res =>
        res.state === "failed" && res.err.message !== "couldnt_find_object", // TODO: find a better way of handling errors
    ) as FailedRequestState | undefined;
    console.timeEnd('catch6');
    console.time('catch7');
    // Redirect to the 404 if there's an API error
    if (error) {
      console.error(error.err);

      if (error.err.message === "instance_is_private") {
        return res.redirect(`/signup`);
      } else {
        res.status(500);
        errorPageData = getErrorPageData(new Error(error.err.message), site);
      }
    }
    console.timeEnd('catch7');
    console.time('catch8');
    const isoData: IsoDataOptionalSite = {
      path,
      site_res: site,
      routeData,
      errorPageData,
    };

    const wrapper = (
      <StaticRouter location={url} context={isoData}>
        <App />
      </StaticRouter>
    );
    console.timeEnd('catch8');
    console.time('catch9');
    const root = renderToString(wrapper);
    console.timeEnd('catch9');
    var end= console.timeEnd('catch');
    
    res.send(await createSsrHtml(root, isoData, res.locals.cspNonce));
  } catch (err) {
    // If an error is caught here, the error page couldn't even be rendered
    console.error(err);
    res.statusCode = 500;

    return res.send(
      process.env.NODE_ENV === "development" ? err.message : "Server error",
    );
  }
};
