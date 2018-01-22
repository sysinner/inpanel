<div id="inops-cluster-cells-alert"></div>

<div class="incp-div-light">
<table class="table table-hover">
  <thead><tr>
    <th>Cell</th>
    <th>Description</th>
    <th>Nodes</th>
    <th>Action</th>
    <th>Updated</th>
    <th></th>
  </tr></thead>
  <tbody id="inops-host-cells"></tbody>
</table>
</div>

<script id="inops-host-cells-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="inops-font-mono">
    <a href="#node-list" onclick="inOpsHost.NodeList('{[=v.zone_id]}', '{[=v.meta.id]}')">{[=v.meta.id]}</a>
  </td>  
  <td>{[=v.description]}</td>
  
  <td>
    <button class="pure-button button-xsmall" 
      onclick="inOpsHost.NodeList('{[=v.zone_id]}', '{[=v.meta.id]}')" href="#cell-set">
      {[=v.node_num]}
    </button>
  </td>
  <td>{[=inOpsHost.ActionTitle(v.phase)]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <button class="pure-button button-xsmall" 
      onclick="inOpsHost.CellSet('{[=v.zone_id]}', '{[=v.meta.id]}')" href="#cell-set">
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
