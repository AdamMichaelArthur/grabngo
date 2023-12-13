//
//  ContentView.swift
//  SaaS Product
//
//  Created by Adam Arthur on 7/13/23.
//

import SwiftUI
import CoreData

struct ContentView: View {
    
   var body: some View {
      VStack {
         Text("Hello, world!")
            .font(.largeTitle)
            .foregroundColor(.white)
      }
      .frame(maxWidth: .infinity)
      .background(Color.blue)
      .edgesIgnoringSafeArea(.all)
      .navigationTitle("VStack Example")
      .navigationBarTitleDisplayMode(.inline)
   }
}

private let itemFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateStyle = .short
    formatter.timeStyle = .medium
    return formatter
}()

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView().environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
    }
}
