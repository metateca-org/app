/**
 * FrontendRouter.gs  [DEPRECATED -- intentionally left as a stub]
 * ---------------------------------------------------------------------------
 * This module used to build whole HTML pages from server-side template
 * strings. The app no longer works that way.
 *
 * Routing now lives in Code.gs:
 *   - doGet()          serves the `index` shell (index.html) and injects the
 *                      requested view with `includePage(view)`.
 *   - resolveViewName() is the allow-list of valid views.
 *   - Client navigation is handled by loadPage() in scripts.html, which
 *     reloads the shell with ?page=index&view=<View>.
 *
 * To add a screen: create a `<View>.html` fragment and add its name to
 * resolveViewName() (and resolveTemplateName()) in Code.gs. Do NOT reintroduce
 * server-side page strings here.
 */
