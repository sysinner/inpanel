<style type="text/css">
.incp-div-label-block .progress {
  margin-bottom: 0;
}
.incp-div-label-block .sub-name {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
}
</style>

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
    <div class="name">Allocated CPU</div>
    <div class="value">
      {[=it.operate.cpu_used]} / {[=it.spec.capacity.cpu]} m
    </div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">Allocated Memory</div>
    <div class="value">
      {[=inCp.UtilResSizeFormat(it.operate.mem_used)]} / {[=inCp.UtilResSizeFormat(it.spec.capacity.mem)]}
    </div>
  </div>
</div>


<div class="incp-div-h-title" style="padding-top:10px">Volumes</div>
{[~it.status.volumes :v]}
<div class="incp-div-label-block-frame-inline">
  <div class="incp-div-label-block incp-div-light">
    <div class="name-strong incp-font-fixspace">{[=v.name]}</div>
    <div class="sub-name">{[=inCp.UtilResSizeFormat(v.used, 2)]} / {[=inCp.UtilResSizeFormat(v.total, 2)]}</div>
    <div class="value">
      <div class="progress">
        <div class="progress-bar" style="width: {[=v._percent]}%;">
          {[=v._percent]}%
        </div>
      </div>
    </div>
  </div>
</div>
{[~]}


<div class="incp-div-h-title" style="padding-top:10px">Network</div>
<div class="incp-div-label-block-frame-inline">
  <div class="incp-div-label-block incp-div-light">
    <div class="name">LAN Peer</div>
    <div class="value">{[=it.spec.peer_lan_addr]}</div>
  </div>
  <div class="incp-div-label-block incp-div-light">
    <div class="name">WAN Address</div>
    <div class="value">{[=it.spec.peer_wan_addr]}</div>
  </div>
</div>
</script>
