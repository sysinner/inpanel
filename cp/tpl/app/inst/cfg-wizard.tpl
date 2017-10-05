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
{[~it.fields :v]}

{[if (v.type == 1) {]}
<div class="l4i-form-group">
  <label>{[=v.title]}</label>
  <div> 
    <input name="fn_{[=v.name]}" class="form-control incp-appinst-cfg-wizard-item" value="{[=v._value]}" {[if (v.auto_fill && v.auto_fill.length > 0) {]}readonly="readonly"{[}]}>
  </div>
</div>
{[}]}

{[if (v.type == 10 && v.default && v.default.length > 4) {]}
<div class="l4i-form-group">
  <label>{[=v.title]}</label>
  <div>
    <a href="#app/inst/cfg/bound/select" onclick="inCpApp.InstConfigWizardAppBound('{[=v.name]}','{[=v.default]}')"
      class="incp-appinst-cfgfield-boundapp-item" 
      style="display:flex;flex-wrap: nowrap;justify-content:space-around;align-items:center">
      <input id="incp-appinst-cfgfield-{[=v.name]}" name="fn_{[=v.name]}" type="hidden" value="{[=v._value]}">
      <div id="incp-appinst-cfgfield-{[=v.name]}-dp" class="incp-font-fixspace" style="flex-grow:1;order:1">
      {[if (!v._value || v._value.length < 12) {]}
        Select a dependency AppInstance to Bound ({[=v.default]}) 
      {[} else {]}
        {[=v._value]}
      {[}]}
      </div>
      <div style="flex-grow:3;order:2;text-align:right">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true" 
          style="flex-grow:1;order:3">
        </span>
      </div>
    </a>
  </div>
</div>
{[}]}

{[~]}
</script>
