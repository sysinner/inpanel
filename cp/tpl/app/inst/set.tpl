
<div id="incp-appset-alert" class="alert alert-danger" style="display:none"></div>

<div id="incp-appset" class="incp-div-light">loading</div>

<script id="incp-appset-tpl" type="text/html">
<div class="card">
  <div class="card-header">App Instance Settings</div>
  <div class="card-body">

    <div class="l4i-form-group">
      <label>Name</label>
      <p><input name="name" class="form-control" value="{[=it.meta.name]}"></p>
    </div>
  
    <div class="l4i-form-group">
      <label>Spec ({[=it.spec.meta.id]})</label>
      <div>
        {[? it._spec_vs]}
        <select id="app_spec_version" class="form-control">
          {[~it._spec_vs :v]}
          <option value="{[=v.version]}" {[if (v.version == it.spec.meta.version) {]}selected="selected"{[}]}>v{[=v.version]} @ {[=l4i.MetaTimeParseFormat(v.created, "Y-m-d H:i:s")]}</option>
          {[~]}
        </select>
        {[??]}
          <input type="hidden" id="app_spec_version" value="{[=it.spec.meta.version]}">
          {[=it.spec.meta.version]}
        {[?]}
      </div>
    </div>
  
    <div class="l4i-form-group">
      <label>
        Bound Pod 
      </label>
  
      <div id="incp-appset-bound">{[=it.operate.pod_id]}</div>
    </div>

    <div class="l4i-form-group">
      <label>Allowed Roles</label>
      <div>
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
      </div>
    </div>

    <div class="l4i-form-group">
      <label>Actions</label>
      <div>
        {[~it._op_actions :v]}
        <span style="margin-right:10px">
          {[if (v.action == it.operate.action) {]}
          <input type="radio" name="op_action" value="{[=v.action]}" checked="checked"> {[=v.title]}
          {[} else {]}
          <input type="radio" name="op_action" value="{[=v.action]}"> {[=v.title]}
          {[}]}
        </span>
        {[~]}
      </div>
    </div>

    <button type="button" class="btn btn-primary" onclick="inCpApp.InstSetCommit()">
      Save
    </button>

    <button type="button" class="btn btn-primary" onclick="inCpApp.InstSetCommitAndDeploy()" style="margin-left:10px">
      Save and Deploy
    </button>

    <button type="button" class="btn btn-default" onclick="inCpApp.InstListRefresh()" style="margin-left:10px">
      Cancel
    </button>
  </div>
</div>
</script>
