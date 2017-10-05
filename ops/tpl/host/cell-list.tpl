<table width="100%"><tr>
  <td width="160" id="inops-host-cells-zones" valign="top" style="padding-right:20px;"></td>
  <td valign="top">
    <table class="table table-hover">
      <thead><tr>
        <th>Cell</th>
        <th>Status</th>
        <th>Description</th>
        <th>Created</th>
        <th>Updated</th>
        <th></th>
      </tr></thead>
      <tbody id="inops-host-cells"></tbody>
    </table>

    <button type="button" 
      class="pure-button pure-button-primary button-small" 
      onclick="inOpsHost.CellSetForm()">
      New Cell
    </button>
  </td>
</tr></table>

<script id="inops-host-cells-zones-tpl" type="text/html">
<h3>Zones</h3>
{[ if (it.items && it.items.length > 0) { ]}
<ul class="inops-nav inops-nav-pills inops-nav-stacked">
{[~it.items :v]}
<li class="{[ if (v.meta.id == it._zoneid) { ]}active-default arrow-right{[ } ]}">
  <a onclick="inOpsHost.CellList('{[=v.meta.id]}')" href="#zone-select">
    {[=v.meta.id]}
  </a>
</li>
{[~]}
</ul>
{[ } else { ]}
<div>No Zones Found</div>
{[ } ]}
</script>

<script id="inops-host-cells-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="inops-font-mono">{[=v.meta.id]}</td>
  <td>{[=v._status_display]}</td>
  <td>{[=v.description]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.created, "Y-m-d")]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <a class="btn btn-default btn-xs" 
	  onclick="inOpsHost.CellSetForm('{[=v.zone_id]}', '{[=v.meta.id]}')" href="#cell-set">
	  Setting
	</a>
  </td>
</tr>
{[~]}
</script>
