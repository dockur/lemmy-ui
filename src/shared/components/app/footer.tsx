import { Component } from "inferno";
import { NavLink } from "inferno-router";
import { GetSiteResponse } from "lemmy-js-client";
import { docsUrl, joinLemmyUrl, repoUrl } from "../../config";
import { I18NextService } from "../../services";
import { VERSION } from "../../version";

interface FooterProps {
  site?: GetSiteResponse;
}

export class Footer extends Component<FooterProps, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    return (
      <footer className="app-footer container-lg navbar navbar-expand-md navbar-light navbar-bg p-3">
        <div className="navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {this.props.site?.version !== VERSION && (
              <li className="nav-item">
                <span className="nav-link">UI: {VERSION}</span>
              </li>
            )}
            <li className="nav-item">
              <span className="nav-link">v{this.props.site?.version}</span>
            </li>
            {this.props.site?.site_view.local_site.legal_information && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/legal">
                  {I18NextService.i18n.t("legal_information")}
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </footer>
    );
  }
}
