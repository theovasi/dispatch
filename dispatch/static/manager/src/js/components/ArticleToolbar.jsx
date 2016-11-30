import React from 'react'
import Toolbar from './Toolbar.jsx'

import { AnchorButton, Intent } from '@blueprintjs/core'

const toolbar = {__html: '<div id="full-toolbar" class="toolbar ql-toolbar ql-snow"><span class="ql-format-group"><button title="Bold" class="ql-format-button ql-bold"><i class="fa fa-bold"></i></button><button title="Italic" class="ql-format-button ql-italic"><i class="fa fa-italic"></i></button><button title="Underline" class="ql-format-button ql-underline"><i class="fa fa-underline"></i></button><button title="H1" data-size="H1" class="ql-format-button ql-header H1"><span>H1</span></button><button title="H2" data-size="H2" class="ql-format-button ql-header H2"><span>H2</span></button><button title="H3" data-size="H3" class="ql-format-button ql-header H3"><span>H3</span></button></span><span class="ql-format-group"><button title="Bullet" class="ql-format-button ql-bullet"><i class="fa fa-list-ul"></i></button><button title="Link" class="ql-format-button ql-link"><i class="fa fa-link"></i></button></span></div>'};

export default function ArticleToolbar(props) {

  function saveArticle(e) {
    props.save()
  }

  return (
    <Toolbar>
      <div className='c-article-editor__toolbar'>
        <div className='c-article-editor__toolbar__editor-buttons' dangerouslySetInnerHTML={toolbar} />
        <div className='c-article-editor__toolbar__article-buttons'>
          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={saveArticle}>Update</AnchorButton>
        </div>
      </div>
    </Toolbar>
  )
}