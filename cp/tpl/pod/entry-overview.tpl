<style>
.table-reset td {
  padding: 3px 10px 3px 0 !important;
  border: 0;
}
</style>
<div id="incp-podentry-index">
  <div id="incp-podentry-overview"></div>
  <div id="incp-podentry-sidebar"></div>
</div>

<script type="text/html" id="incp-podentry-overview-oplog-tpl">
{[?it.op_log]}
<div class="incp-card-frame-row">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">Job Queue of Pod</div>
  <div class="incp-card-body incp-formtable">
    <table class="valign-middle incp-formtable-space-x0050">
    {[~it.op_log :log]}
    <tr class="incp-formtable-tr-line">
      <td style="width:50px; text-align:center;">
      {[ if (log.status == "ok") { ]}
      <span class="fa fa-check-circle incp-color-ok"></span>
      {[ } else if (log.status == "error" || log.status == "fatal") { ]}
      <span class="fa fa-times-circle incp-color-err"></span>
      {[ } else if (log.status == "warn") { ]}
      <span class="fa fa-exclamation-circle incp-color-warn"></span>
      {[ } else { ]}
      <span class="fa fa-info-circle incp-color-info"></span>
      {[ } ]}
      </td>
      <td>
        <div class="incp-fontsize-x0090" style="line-height: 1.20rem">{[=log.name]}</div>
        <div style="line-height: 1.20rem">{[=log.message]}</div>
      </td>
      <td style="width:200px; text-align:right;">
        {[=l4i.UnixMillisecondFormat(log.updated, "Y-m-d H:i:s")]}
      </td>
    </tr>
    {[~]}
    </table>
  </div>
</div>
</div>
</div>
{[?]}


{[? it.replicas]}
{[~it.replicas :rep]}
<div class="incp-card-frame-row">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">
    Job Queue of Rep #{[=rep.rep_id]}
  </div>
  <div class="incp-card-body incp-formtable">
    <table class="valign-middle incp-formtable-space-x0050">
    {[~rep.op_log.items :log]}
    <tr class="incp-formtable-tr-line">
      <td style="width:50px; text-align:center;">
      {[ if (log.status == "ok") { ]}
      <span class="fa fa-check-circle incp-color-ok"></span>
      {[ } else if (log.status == "error" || log.status == "fatal") { ]}
      <span class="fa fa-times-circle incp-color-err"></span>
      {[ } else if (log.status == "warn") { ]}
      <span class="fa fa-exclamation-circle incp-color-warn"></span>
      {[ } else { ]}
      <span class="fa fa-info-circle incp-color-info"></span>
      {[ } ]}
      </td>
      <td>
        <div class="incp-fontsize-x0090" style="line-height: 1.20rem">{[=log.name]}</div>
        <div style="line-height: 1.20rem">{[=log.message]}</div>
      </td>
      <td style="width:200px; text-align:right;">
        {[=l4i.UnixMillisecondFormat(log.updated, "Y-m-d H:i:s")]}
      </td>
    </tr>
    {[~]}
    </table>
  </div>
</div>
</div>
</div>
{[~]}
{[?]}
</script>


<script type="text/html" id="incp-podentry-overview-info-tpl">

<!-- frame-inline/ -->
<div class="incp-card-frame-row incp-card-frame-inline">

<div class="incp-card-frame incp-card-frame-c6">
<div class="incp-div-light">
  <div class="incp-card-title">
    <span>Information</span>
    <span class="incp-card-title-rbar incp-btn-hover" onclick="inCpPod.SetInfo()">
      <span class="fa fa-cog"></span>
	</span>
  </div>
  <div class="incp-card-body">
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
        <div class="name">ID</div>
        <div class="value">{[=it.meta.id]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
        <div class="name">Name</div>
        <div class="value">{[=it.meta.name]}</div>
      </div>
    </div>
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
        <div class="name">Location</div>
        <div class="value">{[=it.spec.zone]} / {[=it.spec.cell]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
        <div class="name">Running</div>
        <div class="value incp-font-ok" id="incp-podentry-status-value">
          - / {[=it.operate.replica_cap]}
        </div>
      </div>
    </div>
  </div>
</div>
</div>


<div class="incp-card-frame incp-card-frame-c6">
<div class="incp-div-light">
  <div class="incp-card-title">
    <span>Spec</span>
    <span class="incp-card-title-rbar incp-btn-hover" onclick="inCpPod.SpecSet()">
      <span class="fa fa-cog"></span>
	</span>
  </div>
  <div class="incp-card-body">
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
        <div class="name">Name</div>
        <div class="value">{[=it.spec.ref.name]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
        <div class="name">Driver</div>
        <div class="value">{[=it.spec._box_image_driver]}</div>
      </div>
    </div>
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
        <div class="name">CPU - RAM</div>
        <div class="value">
          {[=(it.spec._cpu_limit/10).toFixed(1)]} - {[=inCp.UtilResSizeFormat(it.spec._mem_limit * inCp.ByteMB)]}
        </div>
      </div>
      <div class="incp-card-frame incp-card-frame-c6 incp-card-body-inline-item">
        <div class="name">System Volume</div>
        <div class="value">
        {[? it.spec.volumes]}
        {[~it.spec.volumes :v]}
          {[if (v.name == "system") {]}
            {[=inCp.UtilResSizeFormat(v.size_limit * inCp.ByteGB)]}
          {[}]}
        {[~]}
        {[?]}
        </div>
      </div>
    </div>
  </div>
</div>
</div>

</div>
<!-- /frame-inline -->

{[?it.apps]}
<div class="incp-card-frame-row">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">Applications</div>
  <div class="incp-card-body incp-formtable">
    <table class="valign-middle incp-formtable-space-x0050">
    <thead>
      <tr class="incp-formtable-row-line">
        <th>Name</th>
        <th>Spec</th>
        <th>Services</th>
        <th style="text-align:right"></th>
      </tr>
    </thead>
    <tbody>
      {[~it.apps :v]}
      <tr class="incp-formtable-tr-line">
        <td>{[=v.meta.name]}</td>
        <td>
          <a href="#" onclick="inCpAppSpec.Info('{[=v.spec.meta.id]}', null, '{[=v.spec.meta.version]}')">
            {[=v.spec.meta.id]} / v{[=v.spec.meta.version]}
          </a>
        </td>
        <td>{[if (v.spec.service_ports) { ]}{[=v.spec.service_ports.length]}{[ } ]}</td>
        <td align="right">{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
      </tr>
      {[~]}
    </tbody>
    </table>
  </div>
</div>
</div>
</div>
{[?]}


{[?it.operate.replicas]}
<div class="incp-card-frame-row">
<div class="incp-card-frame">
<div class="incp-div-light">
  <div class="incp-card-title">Replicas</div>
  <div class="incp-card-body incp-formtable">
    <table class="valign-middle incp-formtable-space-x0050">
    <thead>
      <tr class="incp-formtable-row-line">
        <th width="40px">ID</th>
        {[if (inCp.syscfg.zone_master.replica_enable) {]}
        <th>Host</th>
        {[}]}
        <th>Service Port Mapping</th>
        <th>Vol</th>
        <th>Status</th>
        <th>Uptime</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    {[~it.operate.replicas :rep]}
    <tr class="incp-formtable-tr-line">
      <td>{[=rep.rep_id]}</td>
      {[if (inCp.syscfg.zone_master.replica_enable) {]}
      <td id="incp-podentry-rep-host-value-{[=rep.rep_id]}" class="incp-font-fixspace">
        {[? rep.node]}{[=rep.node]}{[??]}Scheduling{[?]}
      </td>
      {[}]}
      <td>
        {[? rep.ports]}
        <table class="incp-font-fixspace table-reset" style="width:0%">
          {[~rep.ports :opv]}
          <tr>
            <td>
               {[=opv.box_port]}
            </td>
            <td width="10px">
               &raquo;
            </td>
            <td>
            {[if (opv.name == "http" || opv.name == "https") {]}
              <a href="{[=opv.name]}://{[=opv.wan_addr]}:{[=opv.host_port]}" target="_blank">{[=opv.name]}://{[=opv.wan_addr]}:{[=opv.host_port]}</a>
            {[ } else if (opv.name == "ssh" && opv.box_port == 2022) {]}
              ssh action@{[=opv.wan_addr]} -p {[=opv.host_port]}
            {[ } else {]}
              {[=opv.name]}://{[=opv.wan_addr]}:{[=opv.host_port]}
            {[}]}
            </td>
          </tr>
          {[~]}
        </table>
      {[?]}
      </td>
      <td id="incp-podentry-box-volume-status-value-{[=rep.rep_id]}"></td>
      <td id="incp-podentry-box-action-status-value-{[=rep.rep_id]}"></td>
      <td id="incp-podentry-box-uptime-value-{[=rep.rep_id]}"></td>
      <td id="incp-podentry-repitem-setup-{[=rep.rep_id]}" align="right">
        {[if (inCp.syscfg.zone_master.replica_enable && !inCp.OpActionAllow(it.operate.action, inCp.OpActionDestroy)) {]}
        <span class="incp-btn-hover" onclick="inCpPodRep.Set('{[=it.meta.id]}', {[=rep.rep_id]})">
          <i class="fa fa-cog"></i>
        </span>
        {[}]}
      </td>
    </tr>
    {[~]}
    </tbody>
    </table>
  </div>
</div>
</div>
</div>
{[?]}

</script>

