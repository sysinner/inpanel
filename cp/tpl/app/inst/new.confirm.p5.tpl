
<div id="loscp-app-instnew-cf-alert" class="alert alert-danger" style="display:none"></div>


<div id="loscp-app-instnew-cf-form">
  <div class="l4i-form-group">
    <label>Name</label>
    <p>{[=it.meta.name]}</p>
  </div>

  <div class="l4i-form-group">
    <label>Spec</label>
    <div>{[=it.spec.meta.name]}</div>
  </div>

  <div class="l4i-form-group">
    <label>Pod</label>
    <div>{[=it._operate_pod.meta.name]}</div>
  </div>
</div>
