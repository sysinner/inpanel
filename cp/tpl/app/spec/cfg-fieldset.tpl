<div id="loscp-appspec-cfg-fieldset-alert"></div>

<div id="loscp-appspec-cfg-fieldset-form" class="pure-form pure-form-stacked pure-g">
</div>
<style>
.l4i-form-group {
  padding: 0 20px 0 0;
}
</style>

<script id="loscp-appspec-cfg-fieldset-tpl" type="text/html">

<input type="hidden" name="name_prev" value="{[=it.name]}">

<div class="l4i-form-group pure-u-1-2">
  <label class="">Name</label>
  <div class="">
    <input type="text" class="form-control" name="name" value="{[=it.name]}">
  </div>
</div>

<div class="l4i-form-group pure-u-1-2">
  <label class="">Type</label>
  <div class="">
    <select name="type" class="form-control">
    {[~it._cfgFieldTypes :v]}
      <option value="{[=v.type]}" {[if (it.type == v.type) {]} selected{[}]}>{[=v.title]}</option>
    {[~]}
    </select>
  </div>
</div>

<div class="l4i-form-group pure-u-1-2">
  <label class="">Title</label>
  <div class="">
    <input type="text" class="form-control" name="title" value="{[=it.title]}">
  </div>
</div>


<div class="l4i-form-group pure-u-1-2">
  <label class="">Prompt</label>
  <div class="">
    <input type="text" class="form-control" name="prompt" value="{[=it.prompt]}">
  </div>
</div>

<div class="l4i-form-group pure-u-1-2">
  <label class="">Deault Value</label>
  <div class="">
    <input type="text" class="form-control" name="default" value="{[=it.default]}">
  </div>
</div>

<div class="l4i-form-group pure-u-1-2">
  <label class="">Auto fill value</label>
  <div class="">
    <select name="auto_fill" class="form-control">
    {[~it._cfgFieldAutoFills :v]}
      <option value="{[=v.type]}" {[if (it.auto_fill == v.type) {]} selected{[}]}>{[=v.title]}</option>
    {[~]}
    </select>
  </div>
</div>

<div class="l4i-form-group pure-u-1-1">
  <label class="">Validates</label>
 
  <button class="btn btn-default btn-xs" onclick="losCpAppSpec.CfgFieldSetValidatorNew()">
    <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add new Validator
  </button>

  <div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Regular Expression (RE2)</th>
          <th width="50%">Prompt</th>
          <th></th>
        <tr>
      </thead>
      <tbody id="loscp-app-specset-cfgfield-validators">
        {[~it.validates :fvp]}
        <tr class="loscp-app-specset-cfgfield-validator-item">
          <td>
            <input name="fv_key" type="text" value="{[=fvp.key]}" class="form-control input-sm" placeholder="Regular Expression">
          </td>
          <td>
            <input name="fv_value" type="text" value="{[=fvp.value]}" class="form-control input-sm" placeholder="Prompt Message">
          </td>
          <td align="right">
            <button class="pure-button button-small" onclick="losCpAppSpec.CfgFieldSetValidatorDel(this)">
              Delete
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
  </div>
</div>

</script>

<script id="loscp-app-specset-cfgfield-validator-tpl" type="text/html">
<tr class="loscp-app-specset-cfgfield-validator-item">
  <td>
    <input name="fv_key" type="text" value="" class="form-control input-sm" placeholder="Regular Expression">
  </td>
  <td>
    <input name="fv_value" type="text" value="" class="form-control input-sm" placeholder="Prompt Message">
  </td>
  <td align="right">
    <button class="pure-button button-small" onclick="losCpAppSpec.CfgFieldSetValidatorDel(this)">
      Delete
    </button>
  </td>
</tr>
</script>
