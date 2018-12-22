<div id="inops-host-node-overview"></div>

<script type="text/html" id="inops-host-node-overview-info-tpl">


<div class="incp-card-frame-row incp-card-frame-inline">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">
    <span>Overview</span>
    <span class="incp-card-title-rbar incp-btn-hover" onclick="inOpsHost.NodeSet()">
      <span class="fa fa-cog"></span>
	</span>
  </div>
  <div class="incp-card-body">
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-p25 incp-card-body-inline-item">
        <div class="name">Host</div>
        <div class="value">{[=it.meta.name]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p25 incp-card-body-inline-item">
        <div class="name">Zone / Cell</div>
        <div class="value">{[=it.operate.zone_id]} / {[=it.operate.cell_id]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p25 incp-card-body-inline-item">
        <div class="name">Joined</div>
        <div class="value">{[=l4i.MetaTimeParseFormat(it.meta.created, "Y-m-d")]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p25 incp-card-body-inline-item">
        <div class="name">OS - Kernel</div>
        <div class="value">{[=it.spec.platform.os]} - {[=it.spec.platform.kernel]}</div>
      </div>
    </div>
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-p25 incp-card-body-inline-item">
        <div class="name">Allocated CPU</div>
        <div class="value">{[=it.operate.cpu_used]} / {[=it.spec.capacity.cpu]} m</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p25 incp-card-body-inline-item">
        <div class="name">Allocated Memory</div>
        <div class="value">
          {[=inCp.UtilResSizeFormat(it.operate.mem_used)]} / {[=inCp.UtilResSizeFormat(it.spec.capacity.mem)]}
        </div>
      </div>
      <div class="incp-card-frame incp-card-frame-p25 incp-card-body-inline-item">
        <div class="name">Action</div>
        <div class="value" id="inops-host-node-overview-action">{[=inOpsHost.ActionTitle(it.operate.action)]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p25 incp-card-body-inline-item">
        <div class="name">Uptime</div>
        <div class="value">{[=inCp.TimeUptime(it.status._uptime)]}</div>
      </div>
    </div>
  </div>
</div>
</div>
</div>


<div class="incp-card-frame-row incp-card-frame-inline">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">
    <span>Container Drivers</span>
  </div>
  <div class="incp-card-body">
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">Docker</div>
        <div class="value">{[=it.spec.exp_docker_version]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">Pouch Container</div>
        <div class="value">{[=it.spec.exp_pouch_version]}</div>
      </div>
    </div>
  </div>
</div>
</div>
</div>
   

<div class="incp-card-frame-row incp-card-frame-inline">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">
    <span>Network</span>
  </div>
  <div class="incp-card-body">
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">LAN Peer</div>
        <div class="value">{[=it.spec.peer_lan_addr]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">WAN Address</div>
        <div class="value">{[=it.spec.peer_wan_addr]}</div>
      </div>
    </div>
  </div>
</div>
</div>
</div>
    

<div class="incp-card-frame-row incp-card-frame-inline">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">
    <span>Volumes</span>
  </div>
  <div class="incp-card-body">
    {[~it.status.volumes :v]}
    <div class="incp-grid-space px0020">
      <div class="incp-grid-inrow">
        <span class="incp-grid-item-p50">{[=v.name]}</span>
        <span class="incp-grid-inrow-end">
          {[=inCp.UtilResSizeFormat(v.used, 2)]} / {[=inCp.UtilResSizeFormat(v.total, 2)]}
        </span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: {[=v._percent]}%;">
          {[=v._percent]}%
        </div>
      </div>
    </div>
    {[~]}
  </div> 
</div> 
</div> 
</div> 
</script>
