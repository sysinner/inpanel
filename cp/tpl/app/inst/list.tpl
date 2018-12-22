<div id="incp-appls-alert" class="alert hide"></div>
<div id="incp-appls" class="incp-div-light"></div>

<script id="incp-appls-tpl" type="text/html">
<table class="table table-hover valign-middle">
<thead>
  <tr>
    <th>Instances</th>
    {[? it._options.ops_mode]}
    <th>User</th>
    {[?]}
    <th>AppSpec</th>
    <th>Pod</th>
    <th>Options</th>
    <th>Status</th>
    <th></th>
  </tr>
</thead>
<tbody>
{[~it.items :v]}
<tr>
  <td class="incp-font-fixspace">
    <span><strong>{[=v.meta.name]}</strong></span>
    <div>{[=v.meta.id]}</div>
  </td>
  {[? it._options.ops_mode]}
  <td>{[=v.meta.user]}</td>
  {[?]}
  <td class="incp-font-fixspace">
    <a href="#spec.detail" onclick="inCpAppSpec.Info('{[=v.spec.meta.id]}', null, '{[=v.spec.meta.version]}')">{[=v.spec.meta.id]}/v{[=v.spec.meta.version]}</a>
  </td>
  <td>
    <a href="#pod.detail" onclick="inCpApp.InstPodInfo('{[=v.operate.pod_id]}')" class="incp-font-fixspace">{[=v.operate.pod_id]}</a>
  </td>
  <td>
   {[if (v.operate.options.length > 0) {]}
     <button class="btn btn-sm" onclick="inCpApp.OpOptInfo('{[=v.meta.id]}')" style="width:30px">{[=v.operate.options.length]}</button>
   {[}]}
  </td>
  <td>
    <span class="badge badge-{[if (inCp.OpActionAllow(v.operate.action, inCp.OpActionStart)) {]}success{[} else {]}default{[}]}">
      {[=inCp.OpActionTitle(v.operate.action)]}
    </span>
  </td>
  <td align="right">
    {[if (!inCp.OpActionAllow(v.operate.action, inCp.OpActionDestroy)) {]}
    <button class="btn btn-outline-primary" onclick="inCpApp.InstDeploy('{[=v.meta.id]}')">
      <span class="fa fa-cloud-upload-alt"></span>
      Deploy
    </button>
    <button class="btn btn-outline-primary" onclick="inCpApp.InstSet('{[=v.meta.id]}', '{[=v.spec.meta.id]}')">
      <span class="fa fa-cog"></span>
      Setup
    </button>
    {[}]}
  </td>
</tr>
{[~]}
</tbody>
</table>
</script>

<script type="text/javascript">

$("#incp-appls-qry").submit(function(event) {
    event.preventDefault();
    inCpApp.InstListRefresh();
});

</script>

<script type="text/html" id="incp-appls-optools">
<!--<li>
  <form action="#" class="form-inlines">
    <input id="query_text" type="text"
      class="form-control incp-query-input" 
      placeholder="Press Enter to Search" 
      value="">
  </form>
</li>-->
<li class="incp-btn incp-btn-primary">
  <a href="#" onclick="inCpApp.InstLaunchNew()">
    <span class="fa fa-plus-circle"></span>&nbsp; 
    <span>Create new App Instance</span>
  </a>
</li>
</script>
