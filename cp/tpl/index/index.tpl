<div id="loscp-topbar">
  <div class="loscp-topbar-collapse">
    <ul class="loscp-nav" id="loscp-topbar-siteinfo">
	    <li><img class="loscp-topbar-logo" src="/los/cp/~/cp/img/logo-g1s48.png" title="frontend_header_site_logo_url"></li>
      <li class="loscp-topbar-brand">Control Panel</li>
    </ul>
    <ul class="loscp-nav loscp-topbar-nav" id="loscp-topbar-nav-menus">
      <li><a class="l4i-nav-item" href="#app/index">Applications</a></li>
      <li><a class="l4i-nav-item" href="#pod/index">Pods</a></li>
      <li><a class="l4i-nav-item" href="#res/index">Resources</a></li>
      <li><a class="l4i-nav-item" href="#lps/index">Packages</a></li>
    </ul>
    <ul class="loscp-nav loscp-nav-right" id="loscp-topbar-userbar"></ul>
    <ul class="loscp-nav loscp-nav-right">
      <li><a class="l4i-nav-item" href="https://github.com/lessos/los-soho/issues" target="_blank">Bug Report</a></li>
      <li><a class="l4i-nav-item" href="#about" onclick="losCp.About()">About</a></li>
    </ul>
  </div>
</div>
<div id="comp-content" class="">loading</div>

<script id="loscp-topbar-user-signed-tpl" type="text/html">

<li class="iam-name">{[=it.display_name]}</li>
<li class="iam-photo" id="loscp-topbar-user-signed"><img src="{[=it.photo_url]}"/></li>

<div id="loscp-topbar-user-signed-modal" style="display:none;">
  <img class="iam-photo" src="{[=it.photo_url]}">
  <div class="iam-name">{[=it.display_name]}</div>
  <a class="btn btn-default iam-btn" href="{[=it.iam_url]}" target="_blank">Account Center</a>
  <a class="btn btn-default iam-btn" href="/los/cp/auth/sign-out">Sign out</a>
</div>
</script>
