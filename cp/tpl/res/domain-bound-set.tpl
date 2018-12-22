<div id="incp-resdomain-boundset-alert"></div>

<div id="incp-resdomain-boundset-form">

<div class="l4i-form-group">
  <label class="">Base Path</label>
  <div class="">
    <input type="text" class="form-control" name="bound_basepath" value="{[=it._name]}">
  </div>
</div>

<div class="l4i-form-group">
  <label class="">Type</label>
  <div class="">
    <select name="type" class="form-control" onchange="inCpResDomain.BoundSetTypeOnChange(this)">
      {[~it._types :v]}
      <option value="{[=v.type]}" {[if (it._type == v.type) {]} selected{[}]}>{[=v.title]}</option>
      {[~]}
    </select>
  </div>
</div>

<div id="incp-resdomain-boundset-type-pod" style="display:none">
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
</div>

<div id="incp-resdomain-boundset-type-upstream" style="display:none">
<div class="l4i-form-group">
  <label>IP:Port</label>
  <div>
    <p>example: 127.0.0.1:8080 or 127.0.0.2:8080,127.0.0.3:8080,...</p>
    <input type="text" class="form-control" name="bound_upstream" value="{[=it._value]}">
  </div>
</div>
</div>


<div id="incp-resdomain-boundset-type-redirect" style="display:none">
<div class="l4i-form-group">
  <label>Redirect URL</label>
  <div>
    <input type="text" class="form-control" name="bound_redirect" value="{[=it._value]}">
  </div>
</div>
</div>

<style>
.incp-resdomain-boundset-action label {
  margin-right: 20px;
  font-weight: normal;
}
</style>

<div class="l4i-form-group">
  <label class="">Action</label>
  <div class="incp-resdomain-boundset-action">
    {[~it._actions :av]}
    <label class="form-check form-check-inline">
      <input type="radio" name="bound_action" value="{[=av.action]}" 
      {[if (av.action == it.action) {]}checked{[}]}> {[=av.title]}
    </label>
    {[~]}
  </div>
</div>

</div>
