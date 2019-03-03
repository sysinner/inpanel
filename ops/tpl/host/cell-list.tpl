<div id="inops-cluster-cells-alert"></div>

<div class="incp-div-light">
<table class="table table-hover valign-middle">
  <thead><tr>
    <th>Cell ID</th>
    <th>Description</th>
    <th>Action</th>
    <th>Updated</th>
    <th>Hosts</th>
    <th></th>
  </tr></thead>
  <tbody id="inops-host-cells"></tbody>
</table>
</div>

<script id="inops-host-cells-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="incp-font-fixspace">
    {[=v.meta.id]}
  </td>  
  <td>{[=v.description]}</td>
  <td>{[=inOpsHost.ActionTitle(v.phase)]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td>
    <button class="btn btn-sm btn-outline-primary"
      onclick="inOpsHost.NodeList('{[=v.zone_id]}', '{[=v.meta.id]}')">
      <span class="fa fa-server"></span>
      <span style="display:inline-block;width:30px">{[=v.node_num]}</span>
    </button>
  </td>
  <td align="right">
    <button class="btn btn-sm btn-outline-primary"
      onclick="inOpsHost.CellSet('{[=v.zone_id]}', '{[=v.meta.id]}')">
      <span class="fa fa-cog"></span>
      Setting
    </button>
  </td>
</tr>
{[~]}
</script>

<script type="text/html" id="inops-cluster-cells-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inOpsHost.CellSet()">
    New Cell
  </a>
</li>
</script>
