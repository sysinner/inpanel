<div id="losops-host-zones-alert"></div>

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
  <tbody id="losops-host-zones"></tbody>
</table>

<button type="button" 
  class="pure-button pure-button-primary button-small" 
  onclick="losOpsHost.ZoneSetForm()">
  Add a Region Zone
</button>

<script id="losops-host-zones-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="losops-font-mono">{[=v.meta.id]}</td>
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
    <a class="btn btn-default btn-xs" href="#cell-set" onclick="losOpsHost.ZoneSetForm('{[=v.meta.id]}')">Setting</a>
  </td>
</tr>
{[~]}
</script>
