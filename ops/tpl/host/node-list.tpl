<div id="incp-module-navbar">
  <ul id="incp-module-navbar-menus" class="incp-module-nav">
    <li><a class='l4i-nav-item active' href='#node/list'>Hosts</a></li>
    <!--<li>
      <form id="z28k7l" action="#" class="form-inlines">
        <input id="query_text" type="text"
          class="form-control incp-query-input" 
          placeholder="Press Enter to Search" 
          value="">
      </form>
    </li>-->
  </ul>
  <ul id="incp-module-navbar-optools" class="incp-module-nav incp-nav-right"></ul>
</div>

<div class="incp-div-light">
<table class="table table-hover">
<thead>
<tr>
  <th>ID</th>
  <th>Peer</th>
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
</div>

<script id="inops-host-nodes-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="inops-font-mono">
    <a href="#node-{[=v.meta.id]}" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">{[=v.meta.id]}</a>
  </td>
  <td>{[=v.spec.peer_lan_addr]}</td>
  <td>{[=v.spec.peer_wan_addr]}</td>
  <td>{[=v.spec.capacity.cpu/1e3]} / {[=inCp.UtilResSizeFormat(v.spec.capacity.mem)]}</td>
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
    <button class="pure-button button-xsmall" onclick="inOpsHost.Node(null, '{[=v.meta.id]}', 'stats')">
      <span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span> Graphs
    </button>
    <button class="pure-button button-xsmall"
      onclick="inOpsHost.NodeSetForm(null, null, '{[=v.meta.id]}')">
      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Setup
    </button>
  </td>
</tr>
{[~]}
</script>

<script id="inops-host-nodels-optools" type="text/html">
</script>
