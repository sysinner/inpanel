<div id="inops-host-zones-alert"></div>

<div class="incp-div-light">
<table class="table table-hover valign-middle">
  <thead><tr>
    <th>ID / Name</th>
  	<th>Description</th>
    <th>LAN Address</th>
    <th>WAN Address</th>
    <th>Driver</th>
    <th>Action</th>
    <th width="30px"></th>
  </tr></thead>
  <tbody id="inops-host-zones"></tbody>
</table>
</div>

<script id="inops-host-zones-tpl" type="text/html">

{[~it.items :v]}
<tr onclick="inOpsHost.ZoneEntryIndex('{[=v.meta.id]}')">
  <td class="incp-font-fixspace incp-ctn-hover">
    <span><strong>{[=v.meta.id]}</strong></span>
	<div>{[=v.meta.name]}</div>
  </td>
  <td class="incp-ctn-hover">{[=v.summary]}</td>
  <td class="incp-ctn-hover">
    {[~v.lan_addrs :addr]}
    <div>{[=addr]}</div>
    {[~]}
  </td>
  <td class="incp-ctn-hover">
    {[~v.wan_addrs :addr]}
    <div>{[=addr]}</div>
    {[~]}
  </td>
  <td class="incp-ctn-hover">{[=v.driver.name]}</td>
  <td class="incp-ctn-hover">{[=inOpsHost.ActionTitle(v.phase)]}</td>
  <td align="right" class="incp-ctn-hover">
    <span class="fa fa-chevron-right"></span>
  </td>
</tr>
{[~]}
</script>

<script type="text/html" id="inops-cluster-zones-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inOpsHost.ZoneNew()">
    <span class="fa fa-plus-circle"></span>
    Add a Region Zone
  </a>
</li>
</script>

