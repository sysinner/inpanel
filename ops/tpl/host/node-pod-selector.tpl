<div class="incp-formtable">
  <table class="valign-middle incp-formtable-space-x0050">
    <thead class="incp-formtable-row-line">
      <tr>
        <th>Name<br>ID</th>
        <th>Spec</th>
        <th>User</th>
        <th>CPU<br/>Memory</th>
        <th>Volume</th>
        <th>Apps</th>
        <th>Reps</th>
        <th>Action</th>
        <th width="30px"></th>
      </tr>
    </thead>
    <tbody id="inops-host-podls-selector">
	</tbody>
  </table>
</div>

<div id="inops-host-podls-selector-alert" class="alert hide"></div>

<script id="inops-host-podls-selector-tpl" type="text/html">
{[~it.items :v]}
<tr class="incp-formtable-tr-line hover" onclick="inOpsHost.NodePodInfo('{[=v.meta.id]}')">
  <td class="incp-font-fixspace">{[=v.meta.name]}<br/>{[=v.meta.id]}</td>
  <td>{[=v.spec.ref.id]}</td>
  <td>{[=v.meta.user]}</td>
  <td>
    {[=(v.spec.box.resources.cpu_limit/10).toFixed(1)]}<br/>
	{[=inCp.UtilResSizeFormat(v.spec.box.resources.mem_limit * inCp.ByteMB)]}
  </td>
  <td>
    {[? v.spec.volumes]}
    {[~v.spec.volumes :v2]}
      {[if (v2.name == "system") {]}
        {[=inCp.UtilResSizeFormat(v2.size_limit * inCp.ByteGB)]}
      {[}]}
    {[~]}
    {[?]}
  </td>
  <td>{[=v.apps.length]}</td>
  <td>{[=v.operate.replicas.length]}</td>
  <td>{[=inCp.OpActionTitle(v.operate.action)]}</td>
  <td align="right">
      <span class="fa fa-chevron-right"></span>
  </td>
</tr>
{[~]}
</script>

