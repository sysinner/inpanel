<div id="inops-host-zones-alert"></div>

<table class="table table-hover">
  <thead><tr>
    <th>Zone</th>
    <th>LAN Address</th>
    <th>WAN Address</th>
    <th>Status</th>
    <th>Cells</th>
    <th>Updated</th>
    <th></th>
  </tr></thead>
  <tbody id="inops-host-zones"></tbody>
</table>

<button type="button" 
  class="pure-button pure-button-primary button-small" 
  onclick="inOpsHost.ZoneSetForm()">
  Add a Region Zone
</button>

<script id="inops-host-zones-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="inops-font-mono">{[=v.meta.id]}</td>
  <td>
    {[~v.lan_addrs :addr]}
    <div>{[=addr]}</div>
    {[~]}
  </td>
  <td>
    {[~v.wan_addrs :addr]}
    <div>{[=addr]}</div>
    {[~]}
  </td>
  <td>{[=v._status_display]}</td>
  <td>{[=v.cells.length]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <a class="btn btn-default btn-xs" href="#cell-set" onclick="inOpsHost.ZoneSetForm('{[=v.meta.id]}')">Setting</a>
  </td>
</tr>
{[~]}
</script>
