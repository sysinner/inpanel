<div id="incp-podls-alert"></div>

<div id="incp-podls" class="incp-div-light"></div>

<script type="text/html" id="incp-podls-tpl">
<table class="table table-hover valign-middle">
  <thead>
    <tr>
      <th>Instances</th>
      {[if (!it._zone_active) {]}
      <th>Location</th>
      {[}]}
      {[? it._options.ops_mode]}
      <th>User</th>
      {[?]}
      <th>Spec</th>
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
    {[if (!it._zone_active) {]}
    <td class="incp-ctn-hover">{[=v.spec.zone]} / {[=v.spec.cell]}</td>
    {[}]}
    {[? it._options.ops_mode]}
    <td class="incp-ctn-hover">{[=v.meta.user]}</td>
    {[?]}
    <td class="incp-ctn-hover">{[=v.spec.ref.name]}</td>
    <td class="incp-ctn-hover">{[=v.apps.length]}</td>
    <td class="incp-ctn-hover">
      <span class="badge badge-{[if (inCp.OpActionAllow(v.operate.action, inCp.OpActionRunning)) {]}success{[} else {]}default{[}]}">
      {[=inCp.OpActionTitle(v.operate.action)]}
      </span>
    </td>
    <td align="right">
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
    <td align="right">
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
