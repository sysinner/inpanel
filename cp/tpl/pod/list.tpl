<div id="incp-podls-alert"></div>

<div id="incp-podls" class="incp-div-light"></div>

<script type="text/html" id="incp-podls-tpl">
<table class="table table-hover">
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
      <th>Status</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
{[~it.items :v]}
  <tr>
    <td class="align-middle incp-font-fixspace incp-ctn-hover" onclick="inCpPod.EntryIndex('{[=v.meta.id]}')">
      <span><strong>{[=v.meta.name]}</strong></span>
      <div>{[=v.meta.id]}</div>
    </td>
    {[if (!it._zone_active) {]}
    <td class="align-middle">{[=v.spec.zone]} / {[=v.spec.cell]}</td>
    {[}]}
    {[? it._options.ops_mode]}
    <td class="align-middle">{[=v.meta.user]}</td>
    {[?]}
    <td class="align-middle">{[=v.spec.ref.name]}</td>
    <td class="align-middle">{[=v.apps.length]}</td>
    <td class="align-middle">
      <span class="badge badge-{[if (inCp.OpActionAllow(v.operate.action, inCp.OpActionRunning)) {]}success{[} else {]}default{[}]}">
      {[=inCp.OpActionStatusTitle(v.operate.action)]}
      </span>
    </td>
    <td  class="align-middle" align="right">
      {[if (!inCp.OpActionAllow(v.operate.action, inCp.OpActionDestroy)) {]}
      <button class="pure-button " onclick="inCpPod.EntryIndex('{[=v.meta.id]}', 'stats')">
        <img src="/in/cp/~/open-iconic/svg/dashboard.svg" class="incp-button-icon-12"> Graphs
      </button>
      <button class="pure-button " onclick="inCpPod.SetInfo('{[=v.meta.id]}')">
        <img src="/in/cp/~/open-iconic/svg/cog.svg" class="incp-button-icon-12"> Setup
      </button>
      {[}]}
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
    New Pod Instance
  </a>
</li>
</script>
