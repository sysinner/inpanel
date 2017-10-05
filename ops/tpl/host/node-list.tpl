<table width="100%"><tr>

  <td width="120" id="inops-host-nodes-zones" valign="top" style="padding-right:20px;"></td>

  <td width="160" id="inops-host-nodes-cells" valign="top" style="padding-right:20px;"></td>

  <td valign="top">

    <table id="inops-host-nodes-navbar" width="100%"><tr>
    <td>
      <form id="" action="#" class="">
        <input type="text" class="form-control inops-query-input-icon" id="xs_hostls_qry"
          placeholder="Press Enter to search" value="" />
      </form>
    </td>
	  <td align="right">
      <!-- <button type="button" 
        class="pure-button pure-button-primary button-small" 
        onclick="inOpsHost.NodeNewForm()">
        New Node
      </button> -->
    </td>
    </tr></table>
    
    <table class="table table-hover">
    <thead>
    <tr>
      <th>Host ID</th>
      <th>LAN</th>
      <th>WAN</th>
      <th>CPU / RAM</th>
      <th>Kernel</th>
      <th>Ports</th>
      <th>Action</th>
      <th>Updated</th>
      <th></th>
    </tr>
    </thead>
    <tbody id="inops-host-nodes"></tbody>
    </table>

  </td>
</tr></table>

<script id="inops-host-nodes-zones-tpl" type="text/html">
<h3>Zones</h3>
{[ if (it.items && it.items.length > 0) { ]}
<ul class="inops-nav inops-nav-pills inops-nav-stacked">
{[~it.items :v]}
  <li class="{[ if (v.meta.id == it._zoneid) { ]}active-default arrow-right{[ } ]}">
    <a onclick="inOpsHost.NodeList('{[=v.meta.id]}', null)" href="#zone-select">{[=v.meta.id]}</a>
  </li>
{[~]}
</ul>
{[ } else { ]}
<div>No Zones Found</div>
{[ } ]}
</script>

<script id="inops-host-nodes-cells-tpl" type="text/html">
<h3>Cells</h3>
{[ if (it.items && it.items.length > 0) { ]}
<ul class="inops-nav inops-nav-pills inops-nav-stacked">
{[~it.items :v]}
  <li class="{[ if (v.meta.id == it._cellid) { ]}active-default arrow-right{[ } ]}">
    <a onclick="inOpsHost.NodeList(null, '{[=v.meta.id]}')" href="#cell-select">{[=v.meta.id]}</a>
  </li>
{[~]}
</ul>
{[ } else { ]}
<div>No Cells Found</div>
<div>
  <button class="btn btn-default btn-xs" onclick="inOpsHost.CellSetForm()">New Cell</button>
</div>
{[ } ]}
</script>

<script id="inops-host-nodes-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="inops-font-mono">{[=v.meta.id]}</td>
  <td>{[=v.spec.peer_lan_addr]}</td>
  <td>{[=v.spec.peer_wan_addr]}</td>
  <td>{[=v.spec.capacity.cpu/1e3]} / {[=inCp.UtilResSizeFormat(v.spec.capacity.memory)]}</td>
  <td>{[=v.spec.platform.kernel]}</td>
  <td>
    <button class="button-xsmall pure-button"
      onclick="inOpsHost.NodeOpPortUsedInfo(null, null, '{[=v.meta.id]}')">
      {[=v.operate.port_used.length]}
    </button>
  </td>  
  <td>{[=v._action_display]}</td>
  <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
  <td align="right">
    <button class="pure-button button-xsmall"
	    onclick="inOpsHost.NodeSetForm(null, null, '{[=v.meta.id]}')">
	    Setting
	  </button>
  </td>
</tr>
{[~]}
</script>
