<div id="inops-host-node-overview"></div>

<script type="text/html" id="inops-host-node-overview-info-tpl">

<div class="incp-div-h-title" style="padding-top:10px">Overview</div>
<div class="incp-div-label-block-frame-inline">
  <div class="incp-div-label-block incp-div-light">
    <div class="name">Name</div>
    <div class="value">{[=it.meta.name]}</div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">Zone / Cell</div>
    <div class="value">{[=it.operate.zone_id]} / {[=it.operate.cell_id]}</div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">Action</div>
    <div class="value" id="inops-host-node-overview-action">{[=inOpsHost.ActionTitle(it.operate.action)]}</div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">Uptime</div>
    <div class="value">{[=l4i.UnixTimeFormat(it.status.uptime, "Y-m-d H:i:s")]}</div>
  </div>
</div>

<div class="incp-div-h-title">Spec</div>
<div class="incp-div-label-block-frame-inline">
  <div class="incp-div-label-block incp-div-light">
    <div class="name">OS</div>
    <div class="value">{[=it.spec.platform.os]}</div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">Kernel</div>
    <div class="value">{[=it.spec.platform.kernel]}</div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">CPU</div>
    <div class="value"td>{[=it.spec.capacity.cpu]} m</div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">Memory</div>
    <div class="value"td>{[=inCp.UtilResSizeFormat(it.spec.capacity.mem)]}</div>
  </div>
</div>

<div class="incp-div-h-title" style="padding-top:10px">Network</div>
<div class="incp-div-label-block-frame-inline">
  <div class="incp-div-label-block incp-div-light">
    <div class="name">Peer</div>
    <div class="value">{[=it.spec.peer_lan_addr]}</div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">WAN</div>
    <div class="value">{[=it.spec.peer_wan_addr]}</div>
  </div>
</div>

</script>
