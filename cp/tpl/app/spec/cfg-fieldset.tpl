<div id="incp-appspec-cfg-fieldset-alert"></div>

<div id="incp-appspec-cfg-fieldset-form" class="">
</div>

<style>
#incp-appspec-cfg-fieldset-form .btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  line-height: 120%;
}
#incp-appspec-cfg-fieldset-form button.icon-x20 {
  padding: 0px;
  line-height: 100%;
  width: 22px;
  min-width: 22px;
  height: 22px;
  vertical-align: middle;
  font-size: 16px;
  text-align: center;
}
#incp-appspec-cfg-fieldset-form th {
  font-weight: normal;
}
#incp-appspec-cfg-fieldset-form .card-body {
  padding: 0 10px;
}
</style>

<script id="incp-appspec-cfg-fieldset-tpl" type="text/html">

<input type="hidden" name="name_prev" value="{[=it.name]}">

<table class="incp-formtable">
<tbody>

<tr>
  <td width="220px">Name</td>
  <td width="30px"></td>
  <td>
    <input type="text" class="form-control" name="name" value="{[=it.name]}">
  </td>
</tr>

<tr>
  <td>Type</td>
  <td></td>
  <td>
    <select name="type" class="form-control">
    {[~it._cfgFieldTypes :v]}
      <option value="{[=v.type]}" {[if (it.type == v.type) {]} selected{[}]}>{[=v.title]}</option>
    {[~]}
    </select>
  </td>
</tr>

<tr>
  <td>Title</td>
  <td></td>
  <td>
    <input type="text" class="form-control" name="title" value="{[=it.title]}">
  </td>
</tr>



<tr>
  <td>Prompt</td>
  <td></td>
  <td>
    <input type="text" class="form-control" name="prompt" value="{[=it.prompt]}">
  </td>
</tr>



<tr>
  <td>Default Value</td>
  <td></td>
  <td>
    <input type="text" class="form-control" name="default" value="{[=it.default]}">
  </td>
</tr>



<tr>
  <td>Auto fill value</td>
  <td></td>
  <td>
    <select name="auto_fill" class="form-control">
    {[~it._cfgFieldAutoFills :v]}
      <option value="{[=v.type]}" {[if (it.auto_fill == v.type) {]} selected{[}]}>{[=v.title]}</option>
    {[~]}
    </select>
  </td>
</tr>




<tr>
  <td>Validates</td>
  <td>
    <button class="btn btn-sm icon-x20" onclick="inCpAppSpec.CfgFieldSetValidatorNew()">
      <span class="fa fa-plus"></span>
    </button>
  </td>
  <td>
    <table class="">
      <thead>
        <tr>
          <th>Regular Expression (RE2)</th>
          <th width="50%">Prompt</th>
          <th></th>
        <tr>
      </thead>
      <tbody id="incp-app-specset-cfgfield-validators">
        {[~it.validates :fvp]}
        <tr class="incp-app-specset-cfgfield-validator-item">
          <td>
            <input name="fv_key" type="text" value="{[=fvp.key]}" class="form-control input-sm" placeholder="Regular Expression">
          </td>
          <td>
            <input name="fv_value" type="text" value="{[=fvp.value]}" class="form-control input-sm" placeholder="Prompt Message">
          </td>
          <td align="right">
            <button class="btn btn-sm x20" onclick="inCpAppSpec.CfgFieldSetValidatorDel(this)">
              <span class="fa fa-times"></span>
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </td>
</tr>

</tbody>
</table>

</script>

<script id="incp-app-specset-cfgfield-validator-tpl" type="text/html">
<tr class="incp-app-specset-cfgfield-validator-item">
  <td>
    <input name="fv_key" type="text" value="" class="form-control input-sm" placeholder="Regular Expression">
  </td>
  <td>
    <input name="fv_value" type="text" value="" class="form-control input-sm" placeholder="Prompt Message">
  </td>
  <td width="30px" align="right">
    <button class="btn btn-sm icon-x20" onclick="inCpAppSpec.CfgFieldSetValidatorDel(this)">
      <span class="fa fa-times"></span>
    </button>
  </td>
</tr>
</script>
