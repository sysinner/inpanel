
<div id="incp-appset-alert" class="alert alert-danger" style="display:none"></div>

<div id="incp-appset" class="incp-div-light">loading</div>

<script id="incp-appset-tpl" type="text/html">
<div class="card">
<div class="card-header">App Instance Settings</div>
<div class="card-body">

<table class="incp-formtable">
<tbody>

<tr>
  <td width="260px">Name</td>
  <td width="30px"></td>
  <td>
    <input name="name" class="form-control" value="{[=it.meta.name]}">
  </td>
</tr>


<tr>
  <td>
    Spec Version ({[=it.spec.meta.id]})
  </td>
  <td></td>
  <td>
     {[? it._spec_vs]}
     <select id="app_spec_version" class="form-control">
       {[~it._spec_vs :v]}
       <option value="{[=v.version]}" {[if (v.version == it.spec.meta.version) {]}selected="selected"{[}]}>v{[=v.version]} @ {[=l4i.UnixMillisecondFormat(v.created, "Y-m-d H:i:s")]} {[=v.comment]}</option>
       {[~]}
     </select>
     {[??]}
       <input type="hidden" id="app_spec_version" value="{[=it.spec.meta.version]}">
       {[=it.spec.meta.version]}
     {[?]}
  </td>
</tr>

<tr>
  <td>
    Binding Container
  </td>
  <td></td>
  <td>
    <div id="incp-appset-bound">{[=it.operate.pod_id]}</div>
  </td>
</tr>


<tr>
  <td>
    Allowed Roles
  </td>
  <td></td>
  <td>
    <span style="margin-right:10px">
      <input type="checkbox" name="" value="0" checked="checked" disabled> Owner
    </span>
    {[~it.operate._res_bound_roles.items :v]}
    <span style="margin-right:10px">
      {[if (v._checked) {]}
      <input type="checkbox" name="res_bound_roles" value="{[=v.id]}" checked="checked"> {[=v.name]}
      {[} else {]}
      <input type="checkbox" name="res_bound_roles" value="{[=v.id]}"> {[=v.name]}
      {[}]}
    </span>
    {[~]}
  </td>
</tr>


<tr>
  <td>
    Actions
  </td>
  <td></td>
  <td>
    {[~it._op_actions :v]}
    <span style="margin-right:10px">
      {[if (v.action == it.operate.action) {]}
      <input type="radio" name="op_action" value="{[=v.action]}" checked="checked"> {[=v.title]}
      {[} else {]}
      <input type="radio" name="op_action" value="{[=v.action]}"> {[=v.title]}
      {[}]}
    </span>
    {[~]}
  </td>
</tr>


<tr>
  <td>
  </td>
  <td></td>
  <td>
    <button type="button" class="btn btn-primary" onclick="inCpApp.InstSetCommit()">
      Save
    </button>
    <button type="button" class="btn btn-primary" onclick="inCpApp.InstSetCommitAndDeploy()" style="margin-left:10px">
      Save and Deploy
    </button>
    <button type="button" class="btn btn-default" onclick="inCpApp.InstListRefresh()" style="margin-left:10px">
      Cancel
    </button>
  </td>
</tr>

</tbody>
</table>

</div>
</div>
</script>
