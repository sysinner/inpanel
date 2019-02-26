<div id="incp-topbar">
  <div class="incp-topbar-collapse">
    <ul class="incp-nav" id="incp-topbar-siteinfo">
      <li><img class="incp-topbar-logo" src="/in/cp/~/cp/img/logo-g1s48.png" title="frontend_header_site_logo_url"></li>
      <li class="incp-topbar-brand">InnerStack Ops</li>
    </ul>
    <ul class="incp-nav incp-topbar-nav" id="inops-topbar-nav-menus">
      <li><a class="l4i-nav-item" href="#host/index">Cluster</a></li>
      <li><a class="l4i-nav-item" href="#pod/index">Containers</a></li>
      <li><a class="l4i-nav-item" href="#app/index">Applications</a></li>
    </ul>
    <ul class="incp-nav incp-nav-right" id="incp-topbar-userbar"></ul>
    <ul class="incp-nav incp-nav-right">
      <li><a class="l4i-nav-item" href="/in">inPanel</a></li>
    </ul>
  </div>
</div>
<div id="comp-content" class="">loading</div>

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

<div class="incp-footer">
  <div class="incp-items incp-fontsize-x0090" style="text-align:center">
    <span class="incp-item"><span class="fa fa-award"></span> Powered by <a href="https://www.sysinner.com" target="_blank">InnerStack</a></span>
    <span class="incp-item"><span class="fa fa-bug"></span> <a href="https://github.com/sysinner/innerstack/issues" target="_blank">Bug Report</a></span>
    <span class="incp-item"><span class="fa fa-info-circle"></span> <a class="l4i-nav-item" href="#about" onclick="inCp.About()">About</a></span>
  </div>
</div>
