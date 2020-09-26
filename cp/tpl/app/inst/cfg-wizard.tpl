<div id="incp-appinst-cfg-wizard-alert" class="alert" style="display:none"></div>

<div id="incp-appinst-cfg-wizard"></div>

<style type="text/css">
.incp-appinst-cfgfield-boundapp-item {
  padding: 8px 6px;
  border-radius: 3px;
  border: 2px solid #eee;
  color: #000;
  cursor: pointer;
}
.incp-appinst-cfgfield-boundapp-item:hover {
  background-color: #eee;
}
</style>


<script id="incp-appinst-cfg-wizard-tpl" type="text/html">
<table class="incp-formtable">
<tbody>
{[~it.fields :v]}

{[if (v.type == 1) {]}
<tr>
  <td width="220px">{[=v.title]}</td>
  <td>
    <input name="fn_{[=v.name]}" class="form-control incp-appinst-cfg-wizard-item" value="{[=v._value]}" {[if (v.auto_fill && v.auto_fill.length > 0) {]}readonly="readonly"{[}]}>
    {[? v.description && v.description.length > 0]}
    <small>{[=v.description]}</small>
    {[?]}
  </td>
</tr>
{[}]}

{[if (v.type == 3 || (v.type >= 300 && v.type <= 399)) {]}
<tr>
  <td width="220px">{[=v.title]} {[? v._readOnly === true]}<br>(Read Only){[?]}</td>
  <td>
    <textarea id="fn_{[=v.name]}" name="fn_{[=v.name]}" class="form-control incp-appinst-cfg-wizard-item" {[if (v.auto_fill && v.auto_fill.length > 0) {]}readonly="readonly"{[}]} rows="{[? v._textRows]}{[=v._textRows]}{[??]}4{[?]}">{[=v._value]}</textarea>
    {[? v.description && v.description.length > 0]}
    <small>{[=v.description]}</small>
    {[?]}
  </td>
</tr>
{[}]}
{[~]}
</tbody>
</table>

{[if (it._dep_remotes && it.dep_remotes.length > 0) {]}
{[~ it.dep_remotes :v]}
<div class="l4i-form-group">
  <label>Remotely dependent to AppSpec : {[=v.name]}</label>
  <div>
    <a href="#app/inst/cfg/bound/select" onclick="inCpApp.InstConfigWizardAppBound('{[=v.id]}')"
      class="incp-appinst-cfgfield-boundapp-item" 
      style="display:flex;flex-wrap: nowrap;justify-content:space-around;align-items:center">
      <input id="incp-appinst-cfgfield-{[=v.id]}" name="fn_{[=v.id]}" type="hidden" value="{[=v._app_id]}">
      <div id="incp-appinst-cfgfield-{[=v.id]}-dp" class="incp-font-fixspace" style="flex-grow:1;order:1">
      {[if (!v._app_id || v._app_id.length < 12) {]}
        Select a running AppInstance to Bind ... 
      {[} else {]}
        {[=v._app_id]}
      {[}]}
      </div>
      <div style="flex-grow:3;order:2;text-align:right">
        <span style="flex-grow:1;order:3">
          <span class="fa fa-chevron-right"></span>
        </span>
      </div>
    </a>
  </div>
</div>
{[~]}
{[}]}

</script>
