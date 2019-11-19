<div id="incp-topbar" class="incp-body-frame"></div>

<div class="incp-body-frame">
  <div id="comp-content" class="incp-body-container">loading</div>
</div>

<div id="incp-footer" class="incp-footer"></div>

<script id="incp-topbar-tpl" type="text/html">
  <div class="incp-topbar-collapse incp-body-container">
    <ul class="incp-nav" id="incp-topbar-siteinfo">
      <li>
        <img class="incp-topbar-logo" 
          src="{[=inCp.SysConfigValueIf("innerstack/sys/webui", "cp_navbar_logo", "/in/cp/~/cp/img/logo-g1s48.png")]}" 
          title="frontend_header_site_logo_url">
      </li>
      <li class="incp-topbar-brand">
        {[=inCp.SysConfigValueIf("innerstack/sys/webui", "cp_navbar_title", "InnerStack")]}
      </li>
    </ul>
    <ul class="incp-nav incp-topbar-nav" id="incp-topbar-nav-menus">
      <li><a class="l4i-nav-item" href="#pod/index">Pods</a></li>
      <li><a class="l4i-nav-item" href="#app/index">Applications</a></li>
      <li><a class="l4i-nav-item" href="#ips/index">Packages</a></li>
      <li><a class="l4i-nav-item" href="#res/index">Resources</a></li>
    </ul>
    <ul class="incp-nav incp-nav-right" id="incp-topbar-userbar"></ul>
    <ul class="incp-nav incp-nav-right">
      <li><a class="l4i-nav-item" href="/in/ops" id="incp-nav-ops-entry" style="display:none">Management</a></li>
    </ul>
  </div>
</script>

<script id="incp-footer-tpl" type="text/html">
  <div class="incp-items incp-fontsize-x0090" style="text-align:center">
    <span class="incp-item"><span class="fa fa-award"></span> Powered by <a href="https://www.sysinner.com" target="_blank">InnerStack</a></span>
    <span class="incp-item"><span class="fa fa-bug"></span> <a href="https://github.com/sysinner/innerstack/issues" target="_blank">Bug Report</a></span>
    <span class="incp-item"><span class="fa fa-info-circle"></span> <a class="l4i-nav-item" href="#about" onclick="inCp.About()">About</a></span>
  </div>
</script>

<script id="incp-topbar-user-signed-tpl" type="text/html">

<li class="iam-name">{[=it.display_name]}</li>
<li class="iam-photo" id="incp-topbar-user-signed"><img src="{[=it.photo_url]}"/></li>

<div id="incp-topbar-user-signed-modal" style="display:none;">
  <img class="iam-photo" src="{[=it.photo_url]}">
  <div class="iam-name">{[=it.display_name]}</div>
  <a class="btn btn-outline-primary iam-btn" href="{[=it.iam_url]}" target="_blank">Account Center</a>
  <a class="btn btn-outline-primary iam-btn" href="/in/cp/auth/sign-out">Sign out</a>
</div>
</script>


