
<div id="loscp-app-instset-alert" class="alert alert-danger" style="display:none"></div>

<div id="loscp-app-instset" style="box-sizing: border-box;">loading</div>

<script id="loscp-app-instset-tpl" type="text/html">
<div class="panel panel-default">
  <div class="panel-heading">App Instance Settings</div>
  <div class="panel-body">

    <div class="l4i-form-group">
      <label>Name</label>
      <p><input name="name" class="form-control" value="{[=it.meta.name]}"></p>
    </div>
  
    <div class="l4i-form-group">
      <label>Spec</label>
      <div>
        {[=it.spec.meta.name]}
      </div>
    </div>
  
    <div class="l4i-form-group">
      <label>
        Bound Pod 
      </label>
  
      <div id="loscp-app-instset-bound">{[=it.operate.pod_id]}</div>
    </div>

    <div class="l4i-form-group">
      <label>Allowed Roles to Bind Resources</label>
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
          {[if (v.value == it.operate.action) {]}
          <input type="radio" name="op_action" value="{[=v.value]}" checked="checked"> {[=v.name]}
          {[} else {]}
          <input type="radio" name="op_action" value="{[=v.value]}"> {[=v.name]}
          {[}]}
        </span>
        {[~]}
      </div>
    </div>

    <button type="button" class="btn btn-primary" onclick="losCpApp.InstSetCommit()">
      Save
    </button>

    <button type="button" class="btn btn-default" onclick="losCpApp.InstListRefresh()" style="margin-left:10px">
      Cancel
    </button>
  </div>
</div>
</script>
