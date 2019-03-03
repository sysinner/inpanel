<div class="incp-div-light">
<table class="table table-hover valign-middle">
<thead>
<tr>
  <th>Name<br/>ID</th>
  <th>Network</th>
  <th>Allocated<br/>CPU - Memory</th>
  <th>Priority</th>
  <th>Action</th>
  <th>Ports</th>
  <th>Pods</th>
  <th width="160px"></th>
</tr>
</thead>
<tbody id="inops-host-nodes"></tbody>
</table>
</div>

<script id="inops-host-nodes-tpl" type="text/html">
{[~it.items :v]}
<tr>
  <td class="incp-font-fixspace">
    {[=v.meta.name]}<br/>
    <span class="incp-font-fixspace">{[=v.meta.id]}</span>
  </td>
  <td class="incp-ctn-hover" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">
    {[=v.spec.peer_lan_addr]}<br/>
    {[=v.spec.peer_wan_addr]}
  </td>
  <td class="incp-ctn-hover" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">
    {[=(v.operate.cpu_used/10).toFixed(1)]} / {[=v.spec.capacity.cpu/10]}<br/>
    {[=inCp.UtilResSizeFormat(v.operate.mem_used * inCp.ByteMB)]} / {[=inCp.UtilResSizeFormat(v.spec.capacity.mem * inCp.ByteMB)]}
  </td>
  <td class="incp-ctn-hover" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">
    {[=v.operate.pr]}
  </td>
  <td class="incp-ctn-hover" onclick="inOpsHost.Node(null, '{[=v.meta.id]}')">
    {[=v._action_display]}{[if (v._status) {]}/{[=v._status]}{[}]}
  </td>
  <td>
    <button class="btn btn-sm btn-outline-primary"
      onclick="inOpsHost.NodeOpPortUsedInfo(null, null, '{[=v.meta.id]}')" style="width:40px">
      {[=v.operate.port_used.length]}
    </button>
  </td>
  <td>
    <button class="btn btn-sm btn-outline-primary"
      onclick="inOpsHost.NodePodList(null, null, '{[=v.meta.id]}')">
      <span class="fa fa-boxes"></span>
      <span style="display:inline-block;width:30px">{[=v.operate.box_num]}</span>
    </button>
  </td>
  <td align="right">
    <!--
    <button class="btn btn-sm btn-outline-primary" onclick="inOpsHost.Node(null, '{[=v.meta.id]}', 'stats')">
      <span class="fa fa-chart-line"></span>
    </button>
    -->
    <button class="btn btn-sm btn-outline-primary"
      onclick="inOpsHost.NodeSet(null, null, '{[=v.meta.id]}')" style="width:40px">
      <span class="fa fa-cog"></span>
    </button>
    <button class="btn btn-sm btn-outline-primary"
      onclick="inOpsHost.Node(null, '{[=v.meta.id]}')" style="width:60px">
      <span class="fa fa-chevron-right"></span>
    </button>
  </td>
</tr>
{[~]}
</script>

<script id="inops-host-nodels-optools" type="text/html">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inOpsHost.NodeNew()">
    <span class="fa fa-plus"></span>
    New Host
  </a>
</li>
</script>
