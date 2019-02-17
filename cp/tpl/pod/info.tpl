<style>
.table-reset td {
  padding: 3px 10px 3px 0 !important;
  border: 0;
}
</style>

<table class="incp-formtable">
<tbody>
<tr>
  <td width="200px">Information</td>
  <td>
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">ID</div>
        <div class="value">{[=it.meta.id]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">Name</div>
        <div class="value">{[=it.meta.name]}</div>
      </div>
    </div>
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">Location</div>
        <div class="value">{[=it.spec.zone]} / {[=it.spec.cell]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">Created</div>
        <div class="value">{[=l4i.MetaTimeParseFormat(it.meta.created, "Y-m-d")]}</div>
      </div>
    </div>
  </td>
</tr>

<tr>
  <td>Spec</td>
  <td>
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">Name</div>
        <div class="value">{[=it.spec.ref.name]}</div>
      </div>
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">Driver</div>
        <div class="value">{[=it.spec._box_image_driver]}</div>
      </div>
    </div>
    <div class="incp-card-frame-inline">
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
        <div class="name">CPU - RAM</div>
        <div class="value">
          {[=(it.spec._cpu_limit/10).toFixed(1)]} - {[=inCp.UtilResSizeFormat(it.spec._mem_limit * inCp.ByteMB)]}
        </div>
      </div>
      <div class="incp-card-frame incp-card-frame-p50 incp-card-body-inline-item">
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
  </td>
</tr>

{[?it.apps]}
<tr>
  <td>Applications</td>
  <td class="_incp-formtable">
    <table class="valign-middle">
    <thead>
      <tr class="incp-formtable-row-line">
        <th>Name</th>
        <th>Spec</th>
        <th>Services</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {[~it.apps :v]}
      <tr class="incp-formtable-tr-line">
        <td>{[=v.meta.name]}</td>
        <td>
            {[=v.spec.meta.id]} / v{[=v.spec.meta.version]}
        </td>
        <td>{[if (v.spec.service_ports) { ]}{[=v.spec.service_ports.length]}{[ } ]}</td>
        <td>{[=l4i.MetaTimeParseFormat(v.meta.updated, "Y-m-d")]}</td>
      </tr>
      {[~]}
    </tbody>
    </table>
  </td>
</tr>
{[?]}


{[?it.operate.replicas]}
<tr>
  <td>Replicas</td>
  <td>
    <table class="valign-middle incp-formtable-space-x0050">
    <thead>
      <tr class="incp-formtable-row-line">
        <th width="40px">ID</th>
        {[if (inCp.syscfg.zone_master.replica_enable) {]}
        <th>Host</th>
        {[}]}
        <th>Service Port Mapping</th>
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
    </tr>
    {[~]}
    </tbody>
    </table>
  </td>
</tr>
{[?]}


</tbody>

</table>

