<div id="incp-podls-alert"></div>

<div id="incp-podls" class="incp-div-light"></div>

<script type="text/html" id="incp-podls-tpl">
<table class="table table-hover valign-middle">
  <thead>
    <tr>
      <th>Instances</th>
      {[if (inCp.syscfg.zone_master.multi_zone_enable || inCp.syscfg.zone_master.multi_cell_enable) {]}
      <th>Location</th>
      {[}]}
      {[? it._options.ops_mode || it._options.owner_column]}
      <th>Owner</th>
      {[?]}
      <th>CPU - RAM</th>
      {[? inCp.syscfg.zone_master.multi_replica_enable]}
      <th>Replicas</th>      
      {[?]}
      <th>Apps</th>      
      <th>Action</th>
      <th></th>
      <th width="30px"></th>
    </tr>
  </thead>
  <tbody>
  {[~it.items :v]}
  <tr onclick="inCpPod.EntryIndex('{[=v.meta.id]}')">
    <td class="incp-font-fixspace incp-ctn-hover">
      <span><strong>{[=v.meta.name]}</strong></span>
      <div>{[=v.meta.id]}</div>
    </td>
    {[if (inCp.syscfg.zone_master.multi_zone_enable || inCp.syscfg.zone_master.multi_cell_enable) {]}
    <td class="incp-ctn-hover">
      {[? inCp.syscfg.zone_master.multi_zone_enable]}
        {[=v.spec.zone]}
      {[?]}
      {[? inCp.syscfg.zone_master.multi_cell_enable]}
        {[? inCp.syscfg.zone_master.multi_zone_enable]}<br/>{[?]} {[=v.spec.cell]}
      {[?]}
    </td>
    {[}]}
    {[? it._options.ops_mode || it._options.owner_column]}
    <td class="incp-ctn-hover">{[=v.meta.user]}</td>
    {[?]}
    <td class="incp-ctn-hover">
      <span>{[=(v.spec.box.resources.cpu_limit/10).toFixed(1)]}</span>
      <div>{[=inCp.UtilResSizeFormat(v.spec.box.resources.mem_limit * inCp.ByteMB)]}</div>
    </td>
    {[? inCp.syscfg.zone_master.multi_replica_enable]}
    <td class="incp-ctn-hover">{[=v.operate.replica_cap]}</td>
    {[?]}
    <td class="incp-ctn-hover">{[=v.apps.length]}</td>
    <td class="incp-ctn-hover">
      {[~inCp.OpActions :v2]}
      {[? inCp.OpActionAllow(v.operate.action, v2.action)]}
      <span class="badge bg-{[=v2.style]}">
      {[=valueui.lang.T(v2.title)]}
      </span>
      {[?]}
      {[~]}
    </td>
    <td class="incp-ctn-hover" align="right">
      <!--
      {[if (!inCp.OpActionAllow(v.operate.action, inCp.OpActionDestroy)) {]}
      <button class="btn btn-outline-primary" onclick="inCpPod.EntryIndex('{[=v.meta.id]}', 'stats')">
        <span class="fa fa-chart-line"></span>
        Graphs
      </button>
      <button class="btn btn-outline-primary" onclick="inCpPod.SetInfo('{[=v.meta.id]}')">
        <span class="fa fa-cog"></span>
        Setup
      </button>
      {[}]}
      -->
    </td>
    <td align="right" width="30px">
      <span class="fa fa-chevron-right"></span>
    </td>
  </tr>
  {[~]}
</tbody>
</table>
</script>

<script type="text/javascript">
$("#incp-podls").on("click", ".incp-pod-item", function() {
    var id = $(this).attr("href").substr(1);
    inCpPod.Set(id);
});
</script>


<script type="text/html" id="incp-podls-optools">
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inCpPod.New({})">
    <span class="fa fa-plus-circle"></span>&nbsp; 
    <span>Create new Pod Instance</span>
  </a>
</li>
</script>
