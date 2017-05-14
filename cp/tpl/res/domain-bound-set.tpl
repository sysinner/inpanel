<div id="loscp-resdomain-boundset-alert"></div>

<div id="loscp-resdomain-boundset-form">

<div class="l4i-form-group">
  <label class="">Base Path</label>
  <div class="">
    <input type="text" class="form-control" name="bound_basepath" value="{[=it._name]}">
  </div>
</div>

<div class="l4i-form-group">
  <label class="">Pod ID</label>
  <div class="">
    <input type="text" class="form-control" name="bound_podid" value="{[=it._podid]}">
  </div>
</div>

<div class="l4i-form-group">
  <label class="">Box Port</label>
  <div class="">
    <input type="text" class="form-control" name="bound_boxport" value="{[=it._boxport]}">
  </div>
</div>

<style>
.loscp-resdomain-boundset-action label {
	margin-right: 20px;
	font-weight: normal;
}
</style>

<div class="l4i-form-group">
  <label class="">Action</label>
  <div class="loscp-resdomain-boundset-action">
    {[~it._actions :av]}
    <label class="pure-radio">
      <input type="radio" name="bound_action" value="{[=av.action]}" 
      {[if (av.action == it.action) {]}checked{[}]}> {[=av.title]}
    </label>
    {[~]}
  </div>
</div>

</div>
